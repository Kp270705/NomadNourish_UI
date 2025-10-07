class UserColors{

    // navbar style 
    navbarStyle(){
        return " bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-50 transition-all duration-300 "
    }

    navUlStyle(){
        return " order-1 md:flex md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent " 
    }
    navLiLinkStyle(){
        return " block py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-all duration-300 relative overflow-hidden rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 "
    }
    navBrandStyle(){
        return " flex items-center space-x-3 hover:scale-105 transition-transform duration-200 "
    }

    // dropdown
    
    dropDownStyle(){
        return " bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 mt-2 min-w-48 "
    }

    dropDownItemStyle(){
        return " hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg m-1 transition-colors duration-200 "
    }

    // btns
    navMoreBtn(){
        return " bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 "
    }
    signOutBtn(){
        return " w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 "
    }

    myOrdrdGrdBtnStyle(){
        return " w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 "
    }

    darkModeBtn(){
        return " text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 "
    }

    // hamburger style:
    navHamburgerStyle(){
        return " md:hidden text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 "
    }

}

export default UserColors;