<script>
  import { fly } from "svelte/transition";
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
  <p in:fly={{ y: 40, duration: 600, delay: 0 }}>
    Artificial Intelligence (AI) is a branch of computer science that focuses on creating systems capable of performing tasks that normally require human intelligence.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 100 }}>
    These tasks include learning, reasoning, problem-solving, understanding natural language, and perceiving the environment.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 200 }}>
    AI is often divided into two categories: Narrow AI, designed to handle specific tasks like virtual assistants or recommendation systems, and General AI, which aims to perform any intellectual task a human can.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 300 }}>
    Machine learning, a core subfield of AI, involves training algorithms with data so they can make predictions or decisions without being explicitly programmed.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 400 }}>
    Deep learning, a specialized form of machine learning, uses neural networks to mimic how the human brain processes information.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 500 }}>
    AI is transforming industries such as healthcare, finance, transportation, and entertainment by automating processes and providing data-driven insights.
  </p>

  <p in:fly={{ y: 40, duration: 600, delay: 600 }}>
    While AI offers immense benefits, it also raises ethical concerns like job displacement, privacy, and bias in decision-making, which require careful consideration.
  </p>
</div>
