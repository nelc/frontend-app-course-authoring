/* eslint-disable import/prefer-default-export */
import { camelCaseObject, ensureConfig, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

// import JSZip from 'jszip';
// import saveAs from 'file-saver';

ensureConfig([
  'STUDIO_BASE_URL',
], 'Course Apps API service');

export const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const getVideosUrl = (courseId) => `${getApiBaseUrl()}/api/contentstore/v1/videos/${courseId}`;
export const getCoursVideosApiUrl = (courseId) => `${getApiBaseUrl()}/videos/${courseId}`;

/**
 * Fetches the course custom pages for provided course
 * @param {string} courseId
 * @returns {Promise<[{}]>}
 */
export async function getVideos(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getVideosUrl(courseId));
  return camelCaseObject(data);
}

/**
 * Fetches the course custom pages for provided course
 * @param {string} courseId
 * @returns {Promise<[{}]>}
 */
export async function fetchVideoList(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCoursVideosApiUrl(courseId));
  return camelCaseObject(data);
}

// /**
//  * Fetch asset file.
//  * @param {blockId} courseId Course ID for the course to operate on

//  */
// export async function getDownload(selectedRows, courseId) {
//   const downloadErrors = [];
//   if (selectedRows?.length > 1) {
//     const zip = new JSZip();
//     const date = new Date().toString();
//     const folder = zip.folder(`${courseId}-assets-${date}`);
//     const assetNames = [];
//     const assetFetcher = await Promise.allSettled(
//       selectedRows.map(async (row) => {
//         const asset = row?.original;
//         try {
//           assetNames.push(asset.displayName);
//           const res = await fetch(`${getApiBaseUrl()}/${asset.id}`);
//           if (!res.ok) {
//             throw new Error();
//           }
//           return res.blob();
//         } catch (error) {
//           downloadErrors.push(`Failed to download ${asset?.displayName}.`);
//           return null;
//         }
//       }),
//     );
//     const definedAssets = assetFetcher.filter(asset => asset.value !== null);
//     if (definedAssets.length > 0) {
//       definedAssets.forEach((assetBlob, index) => {
//         folder.file(assetNames[index], assetBlob.value, { blob: true });
//       });
//       zip.generateAsync({ type: 'blob' }).then(content => {
//         saveAs(content, `${courseId}-assets-${date}.zip`);
//       });
//     }
//   } else if (selectedRows?.length === 1) {
//     const asset = selectedRows[0].original;
//     try {
//       saveAs(`${getApiBaseUrl()}/${asset.id}`, asset.displayName);
//     } catch (error) {
//       downloadErrors.push(`Failed to download ${asset?.displayName}.`);
//     }
//   } else {
//     downloadErrors.push('No files were selected to download');
//   }
//   return downloadErrors;
// }

// /**
//  * Fetch where asset is used in a course.
//  * @param {blockId} courseId Course ID for the course to operate on

//  */
// export async function getAssetUsagePaths({ courseId, assetId }) {
//   const { data } = await getAuthenticatedHttpClient()
//     .get(`${getAssetsUrl(courseId)}${assetId}/usage`);
//   return camelCaseObject(data);
// }

/**
 * Delete video from course.
 * @param {blockId} courseId Course ID for the course to operate on

 */
export async function deleteVideo(courseId, videoId) {
  await getAuthenticatedHttpClient()
    .delete(`${getCoursVideosApiUrl(courseId)}/${videoId}`);
}

/**
 * Add asset to course.
 * @param {blockId} courseId Course ID for the course to operate on

 */
export async function addVideo(courseId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await getAuthenticatedHttpClient()
    .post(getCoursVideosApiUrl(courseId), formData);
  return camelCaseObject(data);
}

export async function uploadVideo(
  courseId,
  uploadUrl,
  uploadFile,
  edxVideoId,
) {
  const formData = new FormData();
  formData.append('uploaded-file', uploadFile);
  const uploadErrors = [];
  await fetch(uploadUrl, {
    method: 'PUT',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(async () => {
      await getAuthenticatedHttpClient()
        .post(getCoursVideosApiUrl(courseId), [{
          edxVideoId,
          message: 'Upload completed',
          status: 'upload_completed',
        }]);
    })
    .catch(async () => {
      uploadErrors.push(`Failed to upload ${uploadFile.name}.`);
      await getAuthenticatedHttpClient()
        .post(getCoursVideosApiUrl(courseId), [{
          edxVideoId,
          message: 'Upload failed',
          status: 'upload_failed',
        }]);
    });
  return uploadErrors;
}
