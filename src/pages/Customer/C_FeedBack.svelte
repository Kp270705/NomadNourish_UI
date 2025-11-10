<script lang="ts">
  import { onMount } from 'svelte';
  import { params, push } from 'svelte-spa-router'; 
  import { Textarea, Button, Spinner, Alert } from "flowbite-svelte"; 
  import routesType from '../../config/backend_routes'; 
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';

  let comment = ""; 
  let orderId: number | null = null;
  let loading = false; // For submit button
  let loadingInitial = true; // For initial data fetch
  let error = null;
  let success = null;
  let existingFeedbackId: number | null = null; // To know if we are updating

  $: if ($params && $params.id) {
    const currentId = parseInt($params.id);
    if (currentId !== orderId) {
        orderId = currentId;
        // Fetch existing feedback when orderId is set
        fetchExistingFeedback(); 
    }
  }

  // --- NEW: Fetch existing feedback ---
  async function fetchExistingFeedback() {
    if (!orderId) return;
    loadingInitial = true;
    error = null;
    try {
        const token = localStorage.getItem('jwt_token');
        // NOTE: You need a backend endpoint to get feedback for a specific order
        // Let's assume it's GET /feedback/order/{order_id}
        const response = await fetch(`${routesType.current_route}/feedback/order/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 404) {
            // No feedback exists yet, this is fine
            console.log("No existing feedback found for this order.");
            comment = ""; // Ensure comment is empty
            existingFeedbackId = null;
        } else if (!response.ok) {
            throw new Error('Failed to fetch existing feedback.');
        } else {
            const data = await response.json();
            comment = data.comments || ""; // Populate textarea
            existingFeedbackId = data.id; // Store ID if needed
            console.log("Existing feedback loaded.");
        }
    } catch (err) {
        error = err.message;
        // Don't block editing if fetch fails, maybe show a warning
        console.error("Error fetching feedback:", err);
    } finally {
        loadingInitial = false;
    }
  }

  // --- Function to handle form submission ---
  async function handleSubmit() {
    if (!orderId) {
      error = "Order ID is missing.";
      return;
    }
    if (!comment.trim()) {
      error = "Please enter your feedback before submitting.";
      return;
    }

    loading = true;
    error = null;
    success = null;

    try {
      const token = localStorage.getItem('jwt_token');
      const payload: { order_id: number; comments: string; rating?: number } = {
        order_id: orderId,
        comments: comment,
        // Add rating if you implement it later
        // rating: 5 
      };

      const response = await fetch(`${routesType.current_route}/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to submit feedback.');
      }

      success = "Thank you! Your feedback has been submitted.";
      comment = ""; // Clear the textarea
      // Optional: Redirect back to orders page after a delay
      setTimeout(() => {
        push('/CMy-orders'); // Adjust the route as needed
      }, 2000);

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function goBack() {
    window.history.back();
  }

  // Textarea properties
  let textareaprops = {
    id: "message",
    name: "message",
    label: "Your feedback comments",
    rows: 6, // Increased rows slightly
    placeholder: "Tell us about your experience... 🍲 😋 🍲 "
  };

</script>

<div class="min-h-screen ...">
    <div class="max-w-xl mx-auto">
        <div class="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md">
            {#if loadingInitial}
                <div class="text-center p-10"><Spinner /> Loading...</div>
            {:else}
                 <h1 class="text-2xl font-bold mb-6 ..."> 
                    {existingFeedbackId ? 'Update' : 'Leave'} Feedback for Order #{orderId || '...'}
                 </h1>
                
                {#if error} <Alert color="red" class="mb-4">{error}</Alert> {/if}
                {#if success} <Alert color="green" class="mb-4">{success}</Alert> {/if}

                <form on:submit|preventDefault={handleSubmit}>
                    <div class="mb-6">
                      <Textarea {...textareaprops} bind:value={comment} class="w-full" />
                    </div>
                    
                    <Button type="submit" class="w-full" disabled={loading}>
                        {#if loading} <Spinner class="mr-2" size="4" /> Submitting... {:else} Submit Feedback {/if}
                    </Button>
                </form>
            {/if}
        </div>
    </div>
</div>