import JSZip from "jszip";

document.getElementById("dateForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const startDate = new Date(event.target.startDate.value);
  const endDate = new Date(event.target.endDate.value);

  // Show progress container and hide form
  const progressContainer = document.getElementById("progressContainer");
  const progressDaysBar = document.getElementById("progressDaysBar");
  const progressDaysMessage = document.getElementById("progressDaysMessage");
  const progressJobsBar = document.getElementById("progressJobsBar");
  const progressJobsMessage = document.getElementById("progressJobsMessage");
  const form = document.getElementById("dateForm");
  form.classList.add("hidden");
  progressContainer.classList.remove("hidden");

  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  let processedDays = 0;

  // Iterate through the dates and perform API calls
  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    progressDaysMessage.innerText = `[${processedDays}/${totalDays}] Processing ${currentDate.toISOString().slice(0, 10)}...`;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // Fetch the archive data
    const archiveResponse = await fetch(`https://www.midjourney.com/api/app/archive/day/?day=${day}&month=${month}&year=${year}`);
    const archiveData = await archiveResponse.json();

    // Create a zip file for the current date
    const zip = new JSZip();
    let fileCount = 0;

    let processedJobs = 0;
    let totalJobs = archiveData.length;

    // Process each item in the archive data
    for (const item of archiveData) {
      // const jobId = item.id;
      const jobId = item;
      progressJobsMessage.innerText = `[${processedJobs}/${totalJobs}] Fetching ${jobId}...`;

      // Fetch the job status data
      const jobStatusResponse = await fetch("https://www.midjourney.com/api/app/job-status/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobIds: [jobId] }),
      });
      const jobStatusData = await jobStatusResponse.json();
      // console.log(jobStatusData);

      if (jobStatusData.event.eventType == 'upscale') {
        // Download and process images
        const { image_paths, username, id } = jobStatusData;

        for (const [index, imagePath] of image_paths.entries()) {
          // Fetch the image
          const response = await fetch(imagePath);
          const imageBlob = await response.blob();

          // Add EXIF metadata
          const modifiedBlob = await addExifMetadata(imageBlob, username, id, index);

          // Add the image to the zip file
          zip.file(`${username}_${id}_${index}.png`, modifiedBlob);
          fileCount++;
        }
      }

      processedJobs++;
      progressJobsBar.value = (processedJobs / totalJobs) * 100;
    }
    processedDays++;
    progressDaysBar.value = (processedDays / totalDays) * 100;

    // Generate and download the zip file
    if (fileCount > 0) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `midjourney_archive_${year}-${month}-${day}_[${fileCount}].zip`;
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    }
  }
  progressDaysMessage.innerText = "Download complete!";
});

async function addExifMetadata(imageBlob, username, id, index) {
  // Implement this function to add the required EXIF metadata to the image
  // You may use a library like "piexifjs" to manipulate the EXIF data
  return imageBlob;
}

function sendMessageToBackgroundScript(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}
