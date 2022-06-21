import React, { useEffect, useMemo, useRef } from "react"
import { AiOutlineCamera } from "react-icons/ai"
import { MdClose } from "react-icons/md"
import Resizer from "react-image-file-resizer"
import { useToasts } from "react-toast-notifications"

export const ImageComp = ({
    imgUrl,
    file,
    removeImage,
    handleChange,
    variant = "default",
}: {
    imgUrl?: string
    variant?: "default" | "circle"
    removeImage?: () => void
    handleChange: (file: File | null) => void
    file?: File | null
}) => {
    const resizeFile = (file: File) =>
        new Promise<File>(resolve => {
            Resizer.imageFileResizer(
                file,
                1080,
                1920,
                "WEBP",
                100,
                0,
                uri => {
                    resolve(uri as File)
                },
                "file"
            )
        })

    const inputRef = useRef<HTMLInputElement | null>(null)
    const { addToast } = useToasts()

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files
        if (files && files.length > 0 && files[0]) {
            const file = files[0]
            let image = file
            if (file.size / 1024 > 1024) {
                image = await resizeFile(file)
            }

            if (Math.round(image.size / 1024) > 1024) {
                addToast("Image size is more than 1MB after Compression", {
                    autoDismiss: true,
                    appearance: "error",
                })
                return
            }
            handleChange(image)
        }
    }
    const url = useMemo(() => {
        if (!file) {
            return ""
        }
        return URL.createObjectURL(file)
    }, [file])

    useEffect(() => {
        return () => {
            if (url) {
                URL.revokeObjectURL(url)
            }
        }
    }, [url])

    const image_url = url || imgUrl

    const handleImageClick = () => {
        inputRef.current?.click()
    }
    if (variant === "circle") {
        return (
            <div
                onClick={handleImageClick}
                className="user-img overflow-hidden cursor-pointer "
            > 
                <input
                    ref={inputRef}
                    accept="image/png, image/jpeg"
                    onChange={handleInputChange}
                    type="file"
                    className="d-none"
                />
                <img
                    className="img-fluid h-100"
                    style={{ objectFit: "cover" }}
                    src={image_url}
                />
            </div>
        )
    }  

    return (
        <div onClick={handleImageClick} className="upload-image text-center">
            {image_url ? (
                <>
                    <div
                        onClick={() => {
                            removeImage && removeImage()
                            handleChange(null)
                        }}
                        style={{ 
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 20,
                            height: 20,   
                            borderRadius: 10,
                            background: "#333",
                        }}  
                        className="d-flex align-items-center justify-content-center"
                    >
                        <MdClose color="#fff" />
                    </div>
                    <img className="img-fluid" src={image_url} />
                </>
            ) : ( 
                <>
                    <input
                        ref={inputRef}
                        accept="image/png, image/jpeg"
                        onChange={handleInputChange}
                        type="file"
                        className="d-none"
                    />
                    <span> Upload New image </span>
                    <div className="upload-icon">
                        <AiOutlineCamera />
                    </div>
                </>
            )}
        </div>
    )
}
