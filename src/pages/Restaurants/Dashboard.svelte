<script>
  import { onMount } from 'svelte';
  import { tick } from 'svelte'; // Import tick to wait for the DOM to update
  import { Card, Spinner } from 'flowbite-svelte';
  import { CashSolid, ShoppingBagSolid, ScaleBalancedSolid , ChartPieSolid, FileChartBarSolid } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import Chart from 'chart.js/auto';

  let analytics = null;
  let loading = true;
  let error = null;

  function createBarChart(ctx, label, data, labels, color) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: color,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
      }
    });
  }

  function createLineChart(ctx, label, data, labels) {
     return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  onMount(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/restaurant/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to load analytics.');
      }
      
      analytics = await response.json();
      await tick();

      if (analytics && analytics.total_orders > 0) {
        createBarChart(document.getElementById('topSellingChart'), 'Units Sold', analytics.top_selling_items.map(i => i.value), analytics.top_selling_items.map(i => i.name), 'rgba(54, 162, 235, 0.6)');
        createBarChart(document.getElementById('topRevenueChart'), 'Total Revenue (₹)', analytics.top_revenue_items.map(i => i.value), analytics.top_revenue_items.map(i => i.name), 'rgba(75, 192, 192, 0.6)');
        createLineChart(document.getElementById('revenueTrendChart'), 'Daily Revenue (₹)', analytics.revenue_by_day.map(d => d.revenue), analytics.revenue_by_day.map(d => new Date(d.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})));
      }

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-8">Performance Dashboard</h1>

    {#if loading}
      <div class="text-center py-16"><Spinner size="10" color="orange"/></div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{error}</span>
      </div>
    {:else if analytics && analytics.total_orders > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <Card>
          <CashSolid class="w-8 h-8 text-green-500 mb-2"/>
          <h5 class="text-gray-500 dark:text-gray-400">Total Revenue</h5>
          <p class="text-3xl font-bold dark:text-white">₹{analytics.total_revenue.toFixed(2)}</p>
        </Card>
        <Card>
          <ShoppingBagSolid class="w-8 h-8 text-indigo-500 mb-2"/>
          <h5 class="text-gray-500 dark:text-gray-400">Total Completed Orders</h5>
          <p class="text-3xl font-bold dark:text-white">{analytics.total_orders}</p>
        </Card>
        <Card>
          <ScaleBalancedSolid  class="w-8 h-8 text-purple-500 mb-2"/>
          <h5 class="text-gray-500 dark:text-gray-400">Avg. Order Value</h5>
          <p class="text-3xl font-bold dark:text-white">₹{analytics.average_order_value.toFixed(2)}</p>
        </Card>
      </div>

      <div class="mb-8">
        <Card>
          <h5 class="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><FileChartBarSolid/> Revenue Trend (Last 7 Days)</h5>
          <div class="h-80 relative">
            <canvas id="revenueTrendChart"></canvas>
          </div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h5 class="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><ChartPieSolid/> Top 5 Selling Items (by Quantity)</h5>
          <div class="h-80 relative">
            <canvas id="topSellingChart"></canvas>
          </div>
        </Card>
        <Card>
          <h5 class="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><ChartPieSolid/> Top 5 Revenue Items (by ₹)</h5>
          <div class="h-80 relative">
            <canvas id="topRevenueChart"></canvas>
          </div>
        </Card>
      </div>
    {:else}
      <div class="text-center py-20 text-gray-500">
          <ShoppingBagSolid class="w-16 h-16 mx-auto mb-4"/>
          <h2 class="text-2xl font-bold mb-2 dark:text-white">No Completed Orders Yet</h2>
          <p>Your analytics dashboard will appear here once you start receiving and completing orders.</p>
      </div>
    {/if}
  </div>
</div>