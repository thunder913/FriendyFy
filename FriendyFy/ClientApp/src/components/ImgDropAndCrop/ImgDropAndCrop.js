import React, { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './ImgDropAndCrop.css'
import {
    base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from '../../services/imageService'
import ReactCrop from 'react-image-crop';

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
function ImgDropAndCrop({placeholder, aspectRatio, imgSrc, setImgSrc, imageClass}) {
const defaultCrop = {aspect: aspectRatio, x: 0, y: 0, width: aspectRatio == 1 ? 200 : 355, height: 200, unit:"px"}

    const [imgSrcExt, setImgSrcExt] = useState(null)
    const [crop, setCrop] = useState(defaultCrop)

    const imagePreviewCanvasRef = useRef();
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
    } = useDropzone({
        accept: acceptedFileTypes,
        multiple: false,
        maxSize: imageMaxSize,
        onDropAccepted: (file) => {
            handleOnDrop(file);
        },
    });

    const verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }

    const handleOnDrop = (files) => {
        if (files && files.length > 0) {
            const isVerified = verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    const myResult = myFileItemReader.result
                    setImgSrc(myResult);
                    setImgSrcExt(extractImageFileExtensionFromBase64(myResult));
                }, false)

                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    const handleOnCropChange = (newCrop) => {
        setCrop(newCrop);
    }

    const handleOnCropComplete = (crop, pixelCrop) => {
        const canvasRef1 = imagePreviewCanvasRef.current
        const imageData64 = canvasRef1.toDataURL('image/' + imgSrcExt)
        let image = document.querySelector(`.${imageClass}>div>img`);
        let offsetX = image.naturalWidth/image.offsetWidth;
        let offsetY = image.naturalHeight/image.offsetHeight;

        const canvasRef = imagePreviewCanvasRef.current;
        var newCrop = {
            x: crop.x*offsetX,
            y: crop.y*offsetY,
            width: crop.width*offsetX,
            height: crop.height*offsetY,
            unit: crop.unit,
            aspect: crop.aspect
        }
        image64toCanvasRef(canvasRef, imgSrc, newCrop)


    }

    const handleDownloadClick = (event) => {
        event.preventDefault()
        if (imgSrc) {
            const canvasRef = imagePreviewCanvasRef.current
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)
            const myFilename = "previewFile." + imgSrcExt

            // file to be uploaded
            if(imageData64.length < 10) return;
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
            // download file
            downloadBase64File(imageData64, myFilename)
            handleClearToDefault()
        }
    }

    const handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        setImgSrc(null);
        setImgSrcExt(null);
        setCrop(defaultCrop);
    }

    const handleFileSelect = event => {
        const files = event.target.files
        if (files && files.length > 0) {
            const isVerified = verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    const myResult = myFileItemReader.result
                    setImgSrc(myResult);
                    setImgSrcExt(extractImageFileExtensionFromBase64(myResult));
                }, false)

                myFileItemReader.readAsDataURL(currentFile)

            }
        }
    }

    return (
        <section className="container image-input">
            {imgSrc !== null ?
                <div className="image-crop">
                <button class="remove-image" onClick={handleClearToDefault}>X</button>
                <ReactCrop 
                    src={imgSrc} 
                    crop={crop} 
                    onComplete = {handleOnCropComplete}
                    onChange={handleOnCropChange}
                    className={imageClass}/>
                <canvas style={{display: "none"}} ref={imagePreviewCanvasRef}></canvas>
            </div>  
            :  
            <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>{placeholder}</p>
        </div>
        }

        </section>
    );
}

export default ImgDropAndCrop