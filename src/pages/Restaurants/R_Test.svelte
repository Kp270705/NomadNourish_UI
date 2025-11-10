
<script>
    import { Card, Button } from "flowbite-svelte";
    import { ShoppingBagSolid } from "flowbite-svelte-icons";

    const quickActions = [
        { id: 1, label: "Add New Cuisine", color: "bg-primary hover:bg-primary/90", route: "/add-cuisine" },
        { id: 2, label: "View Analytics", color: "bg-secondary hover:bg-secondary/90", route: "#" },
        { id: 3, label: "Edit Details", color: "bg-muted-foreground hover:bg-muted-foreground/90", route: "/edit-restaurant" },
        { id: 4, label: "Edit Menu Prices", color: "bg-[hsl(174,60%,51%)] hover:bg-[hsl(174,60%,45%)]", route: "#" },
        { id: 5, label: "Edit Status", color: "bg-[hsl(330,85%,55%)] hover:bg-[hsl(330,85%,50%)]", route: "/status-control" },
    ];

    const topItems = [
    { name: "Margherita Pizza", percentage: 85, icon: "🍕" },
    { name: "Caesar Salad", percentage: 72, icon: "🥗" },
    { name: "Chicken Wings", percentage: 64, icon: "🍗" },
  ];


</script>

<div class=" min-h-screen dark:bg-[#0f1729] dark:text-white p-6 lg:p-8 " >
    <div class=" max-w-7xl mx-auto " >

        <!-- Heading:  -->
        <div class="mb-8 animate-fade-in">
          <h1 class="text-4xl font-bold mb-2">
            Welcome back, <span class="text-primary">Name</span>!
          </h1>
          <p class="text-muted-foreground">
            Here's what's happening with your restaurant today.
          </p>
        </div>

        <!-- Main Design:  -->

        <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-10">

            <!-- Left: -->
            <div class=" space-y-6 md:col-span-6 lg:col-span-7 ">

                <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">
                    <div class="p-6" >
                        <h3 class="text-xl font-bold mb-1 ">Quick Actions</h3>
                        <p class="text-sm mb-5text-muted-foreground mb-5 ">Manage your restaurant efficiently</p>
                        <div class="grid grid-cols-2 gap-4">
                            {#each quickActions as qa }    
                            <Button class={` w-full h-14 dark:text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] `} > 
                                hi
                            </Button>
                            {/each}
                        </div>
                    </div>
                </Card>

                <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">
                    <div class="p-6 space-y-6" >
                        <div>
                            <h3 class="text-xl">Top Performing Items</h3>
                            <p class="text-sm text-muted-foreground">Your most popular dishes this week</p>
                        </div>
                        {#each topItems as ti }
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">Me Hello</span>
                                    <span class="font-medium">Me Hello</span>
                                </div>
                                <span class="font-bold">Me Hello%</span>
                            </div>
                        </div>
                        {/each}
                    </div>
                </Card>
                
            </div>

            <!-- Right: -->
            <div class=" space-y-6 md:col-span-4 lg:col-span-5 ">

                <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl" >
                    <div class="p-6 space-y-4" >
                        <h3 class="text-xl">Restaurant Status</h3>

                        <div class="flex items-center justify-between py-3 border-b border-border/50">
                            <span class="text-muted-foreground">Operating Hours</span>
                            <span class="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold">
                                Open
                            </span>
                        </div>

                        <div class="flex items-center justify-between py-3 border-b border-border/50">
                            <span class="text-muted-foreground">Kitchen Status</span>
                            <span class="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-semibold">
                                Busy
                            </span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="text-muted-foreground">Delivery</span>
                            <span class="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-semibold">
                                Active
                            </span>
                        </div>
                        <Button
                        class="text-primary w-full justify-center mt-4">
                        edit status
                        </Button>
                    </div>
                </Card>

                <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl" >
                    <div class="p-6">
                        <div class="flex items-center gap-4">
                            <div class="flex-1">
                                <p class="text-sm text-muted-foreground mb-1">Today's Orders</p>
                                <p class="text-4xl font-bold">127</p>
                                <p class="text-sm text-green-500 mt-1">+12% vs last week</p>
                            </div>
                            <div class="p-4 bg-blue-500/10 rounded-xl">
                                <ShoppingBagSolid class="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </Card>

            </div>

        </div>
        
    </div>
</div>