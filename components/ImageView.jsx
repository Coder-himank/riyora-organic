import Image from "next/image";

const ImageViewer = ({ src, alt }) => {
    return (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }} />
        </div>
    );
}