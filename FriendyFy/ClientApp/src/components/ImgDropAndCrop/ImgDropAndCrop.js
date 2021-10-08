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
function ImgDropAndCrop() {
    const [imgSrc, setImgSrc] = useState(null)
    const [imgSrcExt, setImgSrcExt] = useState(null)
    const [crop, setCrop] = useState({ aspect: 1 / 1 })

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
                    // console.log(myFileItemReader.result)
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
        //console.log(crop, pixelCrop)
        let image = document.querySelector('.ReactCrop__image');
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
            console.log("before handle clear to default")
            handleClearToDefault()
            console.log("after handle clear to default")
        }
    }

    const handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        setImgSrc(null);
        setImgSrcExt(null);
        setCrop({aspect: 1/1});
    }

    const handleFileSelect = event => {
        // console.log(event)
        const files = event.target.files
        if (files && files.length > 0) {
            const isVerified = verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result
                    setImgSrc(myResult);
                    setImgSrcExt(extractImageFileExtensionFromBase64(myResult));
                }, false)

                myFileItemReader.readAsDataURL(currentFile)

            }
        }
    }

    return (
        <section className="container">
            {imgSrc !== null ?
                <div>
                <ReactCrop 
                    src={imgSrc} 
                    crop={crop} 
                    onComplete = {handleOnCropComplete}
                    onChange={handleOnCropChange}/>

                <br/>
                <p>Preview Canvas Crop </p>
                <canvas ref={imagePreviewCanvasRef}></canvas>
                <button onClick={handleDownloadClick}>Download</button>
                <button onClick={handleClearToDefault}>Clear</button>
            </div>  
            :  
            <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only *.jpeg and *.png images will be accepted)</em>
        </div>
        }

        </section>
    );
}

export default ImgDropAndCrop