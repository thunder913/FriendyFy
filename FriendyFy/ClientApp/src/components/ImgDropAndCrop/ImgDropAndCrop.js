import React, {  useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './ImgDropAndCrop.css'
import {
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from '../../services/imageService'
import ReactCrop from 'react-image-crop';

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
function ImgDropAndCrop({placeholder, setCroppedImg, aspectRatio, imageClass}) {
const defaultCrop = {aspect: aspectRatio, x: 0, y: 0, width: 0, height: 0, unit:"px"}

    const [imgSrc, setImgSrc] = useState(null);
    const [, setImgSrcExt] = useState(null)
    const [crop, setCrop] = useState(defaultCrop)
    const [firstTime, setFirstTime] = useState(true);

    const imagePreviewCanvasRef = useRef();
    const {
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
        if(firstTime){
            setFirstTime(false);
        }else{
            setCrop(newCrop);
        }
    }

    const handleOnCropComplete = (crop) => {
        let image = document.querySelector(`.${imageClass}>div>img`);
        let offsetX = image.naturalWidth/image.offsetWidth;
        let offsetY = image.naturalHeight/image.offsetHeight;
        const canvasRef = imagePreviewCanvasRef.current;

        if(firstTime){
            let firstTimeCrop = {
                x: defaultCrop.x*offsetX,
                y: defaultCrop.y*offsetY,
                width: defaultCrop.width*offsetX,
                height: defaultCrop.height*offsetY,
                unit: defaultCrop.unit,
                aspect: defaultCrop.aspect
            }
            image64toCanvasRef(canvasRef, imgSrc, firstTimeCrop, setCroppedImg)          
        }else{
            var newCrop = {
                x: crop.x*offsetX,
                y: crop.y*offsetY,
                width: crop.width*offsetX,
                height: crop.height*offsetY,
                unit: crop.unit,
                aspect: crop.aspect
            }
            image64toCanvasRef(canvasRef, imgSrc, newCrop, setCroppedImg)
        }
    }

    // const handleDownloadClick = (event) => {
    //     event.preventDefault()
    //     if (imgSrc) {
    //         const canvasRef = imagePreviewCanvasRef.current
    //         const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)
    //         const myFilename = "previewFile." + imgSrcExt

    //         // file to be uploaded
    //         if(imageData64.length < 10) return;
    //         const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
    //         // download file
    //         downloadBase64File(imageData64, myFilename)
    //         handleClearToDefault()
    //     }
    // }

    const handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        setImgSrc(null);
        setImgSrcExt(null);
        setCroppedImg(null);
        setCrop(defaultCrop);
        setFirstTime(true);
    }

    // const handleFileSelect = event => {
    //     const files = event.target.files
    //     if (files && files.length > 0) {
    //         const isVerified = verifyFile(files)
    //         if (isVerified) {
    //             // imageBase64Data 
    //             const currentFile = files[0]
    //             const myFileItemReader = new FileReader()
    //             myFileItemReader.addEventListener("load", () => {
    //                 const myResult = myFileItemReader.result
    //                 setImgSrc(myResult);
    //                 setImgSrcExt(extractImageFileExtensionFromBase64(myResult));
    //             }, false)

    //             myFileItemReader.readAsDataURL(currentFile)

    //         }
    //     }
    // }

    const onImageLoaded = image => {
        let height = image.offsetHeight;
        let width = image.offsetWidth;

        if(aspectRatio){
            if(height > width){
                height = width / aspectRatio;
            }else{
                height = width / aspectRatio;
            }
    
            if(height > image.offsetHeight){
                height = image.offsetHeight;
                width = height * aspectRatio;
            }
        }

        defaultCrop.height = height;
        defaultCrop.width = width;
        setCrop(defaultCrop);
    }

    return (
        <section className="container image-input">
            {imgSrc !== null ?
                <div className="image-crop">
                <button className="remove-image" onClick={handleClearToDefault}>X</button>
                <ReactCrop 
                    src={imgSrc} 
                    crop={crop} 
                    onComplete = {handleOnCropComplete}
                    onChange={handleOnCropChange}
                    className={imageClass}
                    onImageLoaded={onImageLoaded}/>
            </div>  
            :  
            <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>{placeholder}</p>
        </div>
        }
        <canvas style={{display: "none"}} ref={imagePreviewCanvasRef}></canvas>

        </section>
    );
}

export default ImgDropAndCrop