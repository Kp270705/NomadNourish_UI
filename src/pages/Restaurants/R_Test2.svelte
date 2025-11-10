<script>
    import { Card, Button, Toggle, Avatar } from "flowbite-svelte";
    import { ArrowRightOutline } from "flowbite-svelte-icons";
    import ButtonComp from "../../components/Buttons/ButtonComp.svelte";
    import ButtonDesign from "../../utils/buttonDes";
    import img from "../../assets/icons/food1.png"
    
    const btn_des = new ButtonDesign();
    const fakePayload = {
        "cuisine_name": "Laposo Pizza",
        "cuisine_desc": "Buinos Dias, Laposo Pizza es te italiano pizza... Tu quiero es foodo.... ",
        "cuisine":"",
    };

</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <div class="lg:col-span-8">

        <!-- Card Part -->
        <div class="space-y-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden">
            <div class="flex flex-col sm:flex-row" >

              <!-- img part -->
              <div class="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0">
                <div class="w-full h-full bg-gradient-to-br from-orange-300 to-red-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center sm:rounded-l-lg rounded-t-lg sm:rounded-t-none">
                  <img src="{img}" alt="Food" class="w-[90%] h-[90%] opacity-90" />
                </div>
              </div>

              <div class="flex-1 p-3 sm:p-4">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full gap-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                      <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>

    </div>
  </div>
</div>
