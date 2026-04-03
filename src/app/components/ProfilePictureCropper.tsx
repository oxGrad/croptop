import React, { useState, useCallback, useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { Download, RefreshCw, ZoomIn, MoveHorizontal, MoveVertical, Circle, Square, Upload } from 'lucide-react'
import getCroppedImg from '../utils/cropImage'

// Example image
import exampleImage from '@/assets/c8016b9499cdb8ec6033063ed0df16505e22fbc6.png'

export function ProfilePictureCropper() {
  const [image, setImage] = useState<string>(exampleImage)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [cropShape, setCropShape] = useState<'round' | 'rect'>('round')
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedAreaPixels(null)
    setCroppedImage(null)
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // Auto-update preview when crop interaction completes
  useEffect(() => {
    if (!croppedAreaPixels) return

    const updatePreview = async () => {
      try {
        const croppedImageBase64 = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        )
        if (croppedImageBase64) {
          setCroppedImage(croppedImageBase64)
        }
      } catch (e) {
        console.error(e)
      }
    }

    updatePreview()
  }, [croppedAreaPixels, rotation, image])

  const handleDownload = async () => {
    if (!croppedImage) return;
    
    // Create an anchor element and trigger download
    const a = document.createElement('a')
    a.href = croppedImage
    a.download = 'profile-photo.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-neutral-200 space-y-8">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl text-sm transition-colors border border-neutral-200"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>

          {/* Cropper Container */}
          <div className="relative w-full h-[400px] sm:h-[500px] bg-[#f0f2f5] rounded-2xl overflow-hidden border border-neutral-200/60 shadow-inner flex items-center justify-center">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              classes={{
                 containerClassName: "rounded-2xl",
                 mediaClassName: "max-w-none"
              }}
            />
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-50 p-3 rounded-2xl border border-neutral-100 gap-3">
              <span className="text-sm font-semibold text-neutral-700 ml-2">Crop Shape</span>
              <div className="flex bg-white p-1 rounded-xl w-full sm:w-auto shadow-sm border border-neutral-200">
                <button
                  onClick={() => setCropShape('round')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${cropShape === 'round' ? 'bg-neutral-100 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  <Circle className="w-4 h-4" /> Round
                </button>
                <button
                  onClick={() => setCropShape('rect')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${cropShape === 'rect' ? 'bg-neutral-100 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  <Square className="w-4 h-4" /> Square
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                    <label className="flex items-center gap-2"><ZoomIn className="w-4 h-4 text-blue-600" /> Zoom</label>
                    <span className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-neutral-200">{zoom.toFixed(1)}x</span>
                </div>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                </div>

                <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                    <label className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-600" /> Rotation</label>
                    <span className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-neutral-200">{rotation}°</span>
                </div>
                <input
                    type="range"
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    aria-labelledby="Rotation"
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                </div>

                <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                    <label className="flex items-center gap-2"><MoveHorizontal className="w-4 h-4 text-blue-600" /> X Position</label>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCrop(prev => ({ ...prev, x: 0 }))}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                            title="Reset X Position"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <input 
                            type="number" 
                            value={Math.round(crop.x)} 
                            onChange={(e) => setCrop(prev => ({ ...prev, x: Number(e.target.value) }))}
                            className="bg-white w-16 px-2 py-0.5 rounded-md shadow-sm border border-neutral-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>
                <input
                    type="range"
                    value={crop.x}
                    min={-500}
                    max={500}
                    step={1}
                    aria-labelledby="X Position"
                    onChange={(e) => setCrop(prev => ({ ...prev, x: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                </div>

                <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                    <label className="flex items-center gap-2"><MoveVertical className="w-4 h-4 text-blue-600" /> Y Position</label>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCrop(prev => ({ ...prev, y: 0 }))}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                            title="Reset Y Position"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <input 
                            type="number" 
                            value={Math.round(crop.y)} 
                            onChange={(e) => setCrop(prev => ({ ...prev, y: Number(e.target.value) }))}
                            className="bg-white w-16 px-2 py-0.5 rounded-md shadow-sm border border-neutral-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>
                <input
                    type="range"
                    value={crop.y}
                    min={-500}
                    max={500}
                    step={1}
                    aria-labelledby="Y Position"
                    onChange={(e) => setCrop(prev => ({ ...prev, y: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                </div>
            </div>
            
            <button
            onClick={handleDownload}
            disabled={!croppedImage}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
            <Download className="w-5 h-5" />
            Download Perfect Crop
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-4 bg-neutral-50 p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full flex items-center gap-3 mb-8">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Live Previews</h3>
                <div className="h-px bg-neutral-200 flex-1"></div>
            </div>
            
            <div className="space-y-12 w-full flex flex-col items-center">
                {/* LinkedIn Style Preview */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="w-full bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="h-24 bg-[#E0DFDC] w-full relative">
                            {/* Banner placeholder */}
                        </div>
                        <div className="px-4 pb-4 pt-10 relative flex flex-col items-center text-center">
                             <div className={`absolute -top-12 w-24 h-24 ${cropShape === 'round' ? 'rounded-full' : 'rounded-xl'} overflow-hidden border-4 border-white bg-white shadow-md flex items-center justify-center z-10 transition-all duration-300`}>
                                {croppedImage ? (
                                    <img src={croppedImage} alt="LinkedIn Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-neutral-400 text-xs text-center p-4">Loading</div>
                                )}
                            </div>
                            <div className="w-32 h-4 bg-neutral-200 rounded-full mb-2"></div>
                            <div className="w-24 h-3 bg-neutral-100 rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-neutral-500">
                        {cropShape === 'round' ? 'LinkedIn Profile' : 'LinkedIn Company Page'}
                    </p>
                </div>

                {/* GitHub Style Preview */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-neutral-200 w-full">
                        <div className={`w-16 h-16 ${cropShape === 'round' ? 'rounded-full' : 'rounded-lg'} overflow-hidden border border-neutral-200 bg-white flex items-center justify-center shrink-0 transition-all duration-300`}>
                            {croppedImage ? (
                                <img src={croppedImage} alt="GitHub Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-neutral-400 text-[10px] text-center p-2">Loading</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="w-24 h-4 bg-neutral-200 rounded-full"></div>
                            <div className="w-16 h-3 bg-neutral-100 rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-neutral-500">
                        {cropShape === 'round' ? 'GitHub Profile' : 'GitHub Organization'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
