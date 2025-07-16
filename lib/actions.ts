// lib/actions.ts

"use server";

import { processAudio } from "@/lib/openai";
import { extractInfoFromImage } from "@/lib/openai-vision";
import { appendToSheet, appendMultipleToSheet } from "@/lib/google-sheets";
import { uploadMultipleFiles } from "@/lib/google-drive";

export async function submitData(formData: FormData) {
  try {
    const imageFile = formData.get("image") as File;
    const audioFile = formData.get("audio") as File;
    const userName = formData.get("userName") as string;

    if (!imageFile || imageFile.size === 0 || !audioFile || audioFile.size === 0) {
      return { success: false, error: "Image and audio files are required." };
    }

    if (!userName || userName.trim() === "") {
      return { success: false, error: "User name is required." };
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Process OCR and audio in parallel, but handle failures gracefully
    const [extractionResult, audioResult] = await Promise.allSettled([
      extractInfoFromImage(imageBuffer),
      processAudio(audioFile)
    ]);

    // Handle OCR result
    let cardData = {
      company: "Unknown_Company",
      name: "Unknown",
      email: "",
      phone: "",
      jobTitle: "",
      badgeId: ""
    };

    if (extractionResult.status === "fulfilled") {
      const extracted = extractionResult.value.cards[0];
      cardData = extracted
        ? {
            ...cardData,
            ...extracted,
            jobTitle: extracted.jobTitle ?? "",
          }
        : cardData;
    } else {
      console.error("OCR processing failed:", extractionResult.reason);
    }

    // Handle audio result
    let audioData = {
      transcription: "Audio processing failed",
      summary: "Audio processing failed"
    };

    if (audioResult.status === "fulfilled") {
      audioData = audioResult.value;
    } else {
      console.error("Audio processing failed:", audioResult.reason);
    }

    // Upload files to Drive (this should always happen)
    const primaryCompany = cardData.company;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const imageFileName = `image_${timestamp}.${imageFile.type.split("/")[1] || "jpg"}`;
    const audioFileName = `audio_${timestamp}.${audioFile.type.split("/")[1] || "webm"}`;

    const uploadResult = await uploadMultipleFiles(
      [
        { buffer: imageBuffer, fileName: imageFileName, mimeType: imageFile.type },
        { buffer: audioBuffer, fileName: audioFileName, mimeType: audioFile.type },
      ],
      primaryCompany,
      userName
    );

    // Prepare sheet data
    const sheetData = {
      userName,
      ...cardData,
      transcription: audioData.transcription,
      summary: audioData.summary,
      folderLink: uploadResult.folderLink,
      imageLink: uploadResult.fileLinks[0] || "Upload Error",
      audioLink: uploadResult.fileLinks[1] || "Upload Error",
    };

    // Add to sheet
    await appendToSheet(sheetData);

    // Determine success message
    let message = "Files uploaded successfully";
    if (extractionResult.status === "fulfilled" && audioResult.status === "fulfilled") {
      message = "All processing completed successfully";
    } else if (extractionResult.status === "rejected" && audioResult.status === "rejected") {
      message = "Files uploaded, but both OCR and audio processing failed";
    } else if (extractionResult.status === "rejected") {
      message = "Files uploaded, but OCR processing failed";
    } else if (audioResult.status === "rejected") {
      message = "Files uploaded, but audio processing failed";
    }

    return {
      success: true,
      message,
    };

  } catch (error) {
    console.error("Error in submitData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}