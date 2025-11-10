class ButtonDesign{

    // medium sized buttons
    md_btn(){
        return `  `
    }

    md_light(){
        return ` px-6 py-3 rounded-lg 
                  font-semibold shadow hover:opacity-95 disabled:opacity-60
                  bg-white text-gray-900 border border-gray-300 
                  hover:bg-gray-100 
                  focus:outline-none focus:ring-gray-100 
                  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 `
    }
    
    md_grdnt_twoColor(col1, col2){
        return ` px-6 py-3 rounded-lg 
                  font-semibold shadow hover:opacity-95 disabled:opacity-60
                  bg-gradient-to-r from-${col1}-500 to-${col2}-500 text-white transition-all duration-300  `
    }

    lg_btn(colorStyle){
        return ` w-full h-14 dark:text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg ${colorStyle} `
    }

}

export default ButtonDesign;