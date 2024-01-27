<template>
  <main>
    <!-- Header -->
    <h1>Video Thumbnail API</h1>
    <p>
      Get thumbnail images from any public video URL via API or browser.
    </p>

    <!-- Form -->
    <form @submit.prevent="submit()" v-if="!imgSrc" class="notice">
      <!-- URL Input-->
      <div>
        <label>URL:</label>
        <input
          type="text"
          v-model="url"
          placeholder="Eg. https://amazon.com/video.mp4"
          style="width: 350px"
        />
      </div>

      <!-- Seconds Input -->
      <div>
        <label>Time (seconds):</label>
        <input type="number" v-model="seconds" placeholder="1" max="10" style="width: 150px" />
      </div>

      <!-- Errors -->
      <div>
        <code v-if="errors">{{ errors }}</code>
      </div>

      <!-- Submit -->
      <button type="submit" :disabled="loading">Get Thumbnail</button>
      <div>
        <small><a href="/?example" @click.prevent="tryDemo()">or try example url</a></small>
      </div>
    </form>

    <div v-if="imgSrc" class="notice">
      <!-- Image -->
      <div class="image-container">
        <img :src="imgSrc" />
        <a :href="imgSrc" download="thumbnail.png" class="button">Download</a>
      </div>

      <!-- API URLs -->
      <div>
        <code>https://localhost:3000/api/get?url={{ url }}&seconds={{ seconds }}</code>
      </div>

      <!-- Clear Button-->
      <div>
        <button @click="clear()" style="width: 100%">Clear</button>
      </div>
    </div>

    <hr />

    <!-- API Infos -->
    <details>
      <summary>Use via API or browser</summary>
      <code style="margin-top: 5px">
        (GET): thumbnail.video/api/get?url={video_url}&seconds=${seconds}
      </code>
    </details>

    <details>
      <summary>Test video URLs</summary>
    </details>
  </main>
</template>

<script setup lang="ts">
const url = ref('')
const seconds = ref(1)
const loading = ref(false)
const imgSrc = ref('')
const errors = ref('')
const demoURL = ref(
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
)

useSeoMeta({ title: 'Video Thumbnail API' })

function tryDemo() {
  if (loading.value) {
    return
  }
  url.value = demoURL.value
  submit()
}

async function submit() {
  loading.value = true
  imgSrc.value = ''
  errors.value = ''

  // send plausible event
  useTrackEvent('getThumbnail')

  try {
    const getURL = `/api/get?url=${encodeURIComponent(url.value)}&seconds=${seconds.value}`
    const response = await $fetch<Buffer>(getURL)
    processImageBuffer(response)
  } catch (error: any) {
    console.log('Error getting thumbnail:', error)
    errors.value = error.statusMessage || error.message
  }

  loading.value = false
}

function processImageBuffer(imageBuffer: Buffer) {
  const imageBlob = new Blob([imageBuffer], { type: 'image/png' })
  const objectURL = URL.createObjectURL(imageBlob)
  imgSrc.value = objectURL
}

function clear() {
  url.value = ''
  imgSrc.value = ''
}
</script>

<style>
/* Background and Text Colors */
main {
  background-color: #f8f8f8; /* Set your desired background color */
  color: #333; /* Set your desired text color */
  padding: 20px; /* Add padding to the main container */
}

/* Header Styles */
h1 {
  color: #4285f4; /* Set your desired header text color */
}

/* Form Styles */
form {
  background-color: #fff; /* Set your desired form background color */
  border-radius: 8px; /* Add some border radius to the form */
  padding: 20px; /* Add padding to the form */
  margin-bottom: 20px; /* Add margin at the bottom of the form */
}

/* Input Styles */
input {
  border: 1px solid #ccc; /* Set border color for inputs */
  padding: 8px; /* Add padding to inputs */
  border-radius: 4px; /* Add border radius to inputs */
}

/* Button Styles */
button {
  background-color: #4285f4; /* Set your desired button background color */
  color: #fff; /* Set your desired button text color */
  padding: 10px; /* Add padding to buttons */
  border: none; /* Remove button border */
  cursor: pointer; /* Add pointer cursor to buttons */
  border-radius: 4px; /* Add border radius to buttons */
}

button:disabled {
  background-color: #ccc; /* Set disabled button background color */
  cursor: not-allowed; /* Set cursor to not-allowed for disabled buttons */
}

/* Image Styles */
.image-container {
  position: relative;
  margin-top: 20px; /* Add margin at the top of the image container */
}

.image-container > a {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #4285f4; /* Set your desired download button background color */
  color: #fff; /* Set your desired download button text color */
  padding: 8px; /* Add padding to download button */
  border-radius: 4px; /* Add border radius to download button */
  text-decoration: none; /* Remove default link underline */
}

.image-container > img {
  width: 100%;
  border-radius: 4px; /* Add border radius to images */
}

/* API Infos Styles */
details {
  margin-top: 20px; /* Add margin at the top of details */
}

/* Code Styles */
code {
  background-color: #f2f2f2; /* Set your desired code background color */
  padding: 5px; /* Add padding to code blocks */
  border-radius: 4px; /* Add border radius to code blocks */
  font-family: monospace; /* Use a monospace font for code */
}
</style>

