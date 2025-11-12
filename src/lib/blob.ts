import { put, del } from "@vercel/blob";

export async function uploadPetPhoto(file: File, petId: string) {
  const filename = `pets/${petId}/${Date.now()}-${file.name}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
  };
}

export async function uploadDocument(file: File, petId: string, documentType: string) {
  const filename = `documents/${petId}/${documentType}/${Date.now()}-${file.name}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
  };
}

export async function deletePetPhoto(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
}

export async function deleteDocument(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
