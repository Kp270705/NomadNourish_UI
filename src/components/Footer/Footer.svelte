<script lang="ts">
  import { Footer, FooterCopyright, FooterLinkGroup, FooterBrand, FooterLink } from "flowbite-svelte";
</script>

<Footer footerType="logo" class="bg-gray-200 border-gray-200 dark:bg-gray-900 px-4 py-0 sm:py-2 text-gray-400 border-t border-gray-900">
  <div class="sm:flex sm:items-center sm:justify-between">
    <FooterBrand href="https://flowbite.com" src="/images/flowbite-svelte-icon-logo.svg" alt="Flowbite Logo" name="Flowbite" class="text-xs" />
    <FooterLinkGroup class="mb-1 flex flex-wrap items-center text-xs text-gray-500 sm:mb-0 dark:text-gray-400">
      <FooterLink href="/" class="text-xs">About</FooterLink>
      <FooterLink href="/" class="text-xs">Privacy Policy</FooterLink>
      <FooterLink href="/" class="text-xs">Licensing</FooterLink>
      <FooterLink href="/" class="text-xs">Contact</FooterLink>
    </FooterLinkGroup>
  </div>
  <hr class="my-1 border-gray-200 sm:mx-auto dark:border-gray-700" />
  <FooterCopyright href="/" by="Flowbite™" class="text-xs" />
</Footer>