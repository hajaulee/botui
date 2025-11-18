/**
 * SkeletonMemoryCard Component
 * Loading skeleton khi memory chưa được load
 */

export default {
  template: /* html */`
    <div class="animate-pulse">
      <div class="group relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Gradient Border Top -->
        <div class="h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>

        <!-- Header -->
        <div class="px-5 py-4 space-y-3">
          <!-- Title skeleton -->
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">🎉</div>
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-gray-200 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <!-- Date skeleton -->
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded-full w-1/2"></div>
            <div class="h-6 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>

        <!-- Image skeleton -->
        <div class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>

        <!-- Content skeleton -->
        <div class="px-5 py-4 space-y-3">
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded-full"></div>
            <div class="h-4 bg-gray-200 rounded-full w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded-full w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  `
};
