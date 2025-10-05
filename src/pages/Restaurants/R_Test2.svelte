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

<div class="mb-8 animate-fade-in">
    <h1 class="text-4xl font-bold mb-2">
    Welcome back, <span class="text-primary">Name</span>!
    </h1>
    <p class="text-muted-foreground"> Here's what's happening with your restaurant today.</p>
</div>

<div class="flex w-full bg-amber-100 ">

    <div class=" flex flex-col items-center justify-center gap-[5vh] w-[60%] h-full bg-pink-200 ">
        <Card class="animate-fade-in border-border/50 w-[100%] bg-blue-100 ">
            <div>
                <div class="text-xl">Quick Actions</div>
                <p class="text-sm text-muted-foreground">Manage your restaurant efficiently</p>
            </div>
            <div>
                <div class="grid grid-cols-2 gap-4">
                    {#each quickActions as qa }    
                    <Button class={` text-white font-semibold h-14 text-base shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] `} > 
                        hi
                    </Button>
                    {/each}
                </div>
            </div>
        </Card>
        <Card class="animate-fade-in border-border/50 w-[100%] bg-blue-100 ">
            <div>
                <div class="text-xl">Top Performing Items</div>
                <p class="text-sm text-muted-foreground">Your most popular dishes this week</p>
            </div>
            <div class="space-y-6">
                {#each topItems as ti }
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">Me Hello</span>
                            <span class="font-medium">Me Hello</span>
                        </div>
                        <span class="font-bold">Me Hello%</span>
                    </div>
                    <!-- <Progress value=Me Hello class="h-2" /> -->
                </div>
                {/each}
            </div>
        </Card>
    </div>

    <div class=" flex flex-col items-center justify-center gap-[5vh] w-[40%] h-full bg-green-200  ">
        <Card class="animate-fade-in border-border/50 w-[100%]" >
            <div>
                <div class="text-xl">Restaurant Status</div>
            </div>
            <div class="space-y-4">
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

        <Card class="animate-scale-in border-border/50 w-[100%] shadow-lg" >
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