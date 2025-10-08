import styles from "@/styles/ImageUploader.module.css";
import { handleFileSelect, handleImageDrop } from "@/utils/utils";
import { useState } from "react";
import toast from "react-hot-toast";

const uploadImage = async (e, ftype, setUploading, setDataFunction, fileFolder, setDragOver) => {
    try {
        setUploading(true);
        if (ftype === "Image Drop") {
            await handleImageDrop(e, setDataFunction, fileFolder, setDragOver);
        }
        if (ftype === "File Select") {
            await handleFileSelect(e, setDataFunction, fileFolder);
        }
    } catch (err) {
        toast.error("Error Uploading the file");
    } finally {
        setUploading(false);
    }
};

export const ImageUploader = ({ image, setDataFunction, removeDataFunction, fileFolder }) => {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [lightboxType, setLightboxType] = useState("image");

    const openLightbox = (src, type) => {
        setLightboxSrc(src);
        setLightboxType(type);
        setLightboxOpen(true);
    };

    return (
        <>
            <div
                className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => uploadImage(e, "Image Drop", setUploading, setDataFunction, fileFolder, setDragOver)}
            >
                <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={(e) => uploadImage(e, "File Select", setUploading, setDataFunction, fileFolder, setDragOver)}
                />
                <label className={`${styles.button} ${styles.buttonPrimary}`} style={{ marginLeft: "8px", cursor: "pointer" }}>
                    {uploading ? "Uploading..." : "Drag & drop image/video here or Choose File"}
                </label>

                {image && (
                    <div className={styles.imageWrapper}>
                        {image.endsWith(".mp4") || image.endsWith(".mov") || image.endsWith(".webm") ? (
                            <video
                                src={image}
                                width={150}
                                height={150}
                                onClick={() => openLightbox(image, "video")}
                                style={{ cursor: "pointer" }}
                            />
                        ) : (
                            <img
                                src={image}
                                alt="Preview"
                                className={styles.previewImage}
                                onClick={() => openLightbox(image, "image")}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                        <button type="button" className={styles.removeImageBtn} onClick={removeDataFunction}>X</button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
                    <div className={styles.lightboxContent}>
                        {lightboxType === "image" ? (
                            <img src={lightboxSrc} alt="Preview" />
                        ) : (
                            <video src={lightboxSrc} controls autoPlay />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export const MultiImageUploader = ({ images, setDataFunction, removeDataFunction, fileFolder }) => {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [lightboxType, setLightboxType] = useState("image");

    const openLightbox = (src, type) => {
        setLightboxSrc(src);
        setLightboxType(type);
        setLightboxOpen(true);
    };

    return (
        <>
            <input
                type="file"
                multiple
                accept="image/*,video/*"
                style={{ display: "none" }}
                id="fileInput"
                onChange={(e) => uploadImage(e, "File Select", setUploading, setDataFunction, fileFolder, setDragOver)}
            />

            <div
                className={`${styles.MultiDropZone} ${dragOver ? styles.dragOver : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => uploadImage(e, "Image Drop", setUploading, setDataFunction, fileFolder, setDragOver)}
            >
                <label htmlFor="fileInput" className={styles.filePickerBtn}>
                    {uploading ? "Uploading..." : "Drag & drop OR click here to upload images/videos"}
                </label>

                {images?.length > 0 && (
                    <div className={styles.MultiImagePreview}>
                        {images.map((url, idx) => {
                            const isVideo = url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm");
                            return (
                                <div key={idx} className={styles.MultiImageWrapper}>
                                    {isVideo ? (
                                        <video
                                            src={url}
                                            width={150}
                                            height={150}
                                            onClick={() => openLightbox(url, "video")}
                                            style={{ cursor: "pointer" }}
                                            controls={false}
                                        />
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`Preview ${idx}`}
                                            onClick={() => openLightbox(url, "image")}
                                            style={{ cursor: "pointer" }}
                                        />
                                    )}
                                    <button type="button" className={styles.removeImageBtn} onClick={() => removeDataFunction(idx)}>x</button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
                    <div className={styles.lightboxContent}>
                        {lightboxType === "image" ? (
                            <img src={lightboxSrc} alt="Preview" />
                        ) : (
                            <video src={lightboxSrc} controls autoPlay />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageUploader;
