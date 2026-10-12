import Image from "next/image";
import styles from "./ReviewGallery.module.css";

const images = [
  {
    src: "/J-Cleaning%231.png",
    alt: "제이클리닝 시공 후기 1",
    width: 1122,
    height: 1402,
  },
  {
    src: "/J-Cleaning%232.png",
    alt: "제이클리닝 시공 후기 2",
    width: 1536,
    height: 1024,
  },
  {
    src: "/J-Cleaning%233.png",
    alt: "제이클리닝 시공 후기 3",
    width: 1536,
    height: 1024,
  },
  {
    src: "/J-Cleaning%234.png",
    alt: "제이클리닝 시공 후기 4",
    width: 1122,
    height: 1402,
  },
];

export default function ReviewGallery() {
  return (
    <div className={styles.gallery}>
      {images.map((image) => (
        <figure key={image.src} className={styles.item}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 100vw, 50vw"
            className={styles.image}
          />
        </figure>
      ))}
    </div>
  );
}
