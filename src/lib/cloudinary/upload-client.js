export async function uploadImageToCloudinary(file) {
  const sigRes = await fetch("/api/upload/signature", { method: "POST" });
  const sigData = await sigRes.json();
  if (!sigData.success) throw new Error(sigData.message || "Upload failed");

  const { timestamp, folder, signature, cloudName, apiKey } = sigData.data;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.secure_url) throw new Error("Upload failed");
  return uploadData.secure_url;
}
