import { concatMap, map, Observable, Observer, switchMap } from "rxjs"
import { FireImg, FireImgSet, Images } from "../services/artist/model/artist-form"

export abstract class ImgSize {
    public static readonly bg: Size = { width: 1200, height: 800 }
    public static readonly miniBg: Size = { width: 414, height: 233 }

    public static readonly avatar: Size = { width: 200, height: 200 }
    public static readonly mini: Size = { width: 50, height: 50 }
}

export interface Size {
    width: number
    height: number
}


export abstract class ImgUtil {

    public static readonly DEFAULT_WIDTH_TO_RESIZE = ImgSize.bg.width
    public static readonly DEFAULT_HEIGHT_TO_RESIZE = ImgSize.bg.height

    
    public static resizeImgFile$(_file: File, fileName?: string, size?: Size): Observable<File> {
      return ImgUtil.blobToImage$(_file).pipe(
        switchMap(image => ImgUtil.resizeImage$(image, size?.width, size?.height)),
        map(blob => ImgUtil.blobToFile(blob, fileName || _file.name))
      )
    }

    private static blobToImage$(blob: Blob): Observable<HTMLImageElement> {
        return new Observable((observer) => {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const img = new Image();
                img.onload = () => {
                  observer.next(img)
                  observer.complete()
                }
                img.onerror = () => {
                  observer.error("Error when loading file")
                  observer.complete()
                }
                img.src = event.target.result;
            };
            reader.readAsDataURL(blob)
        })
    }

    public static blobToFile(blob: Blob, fileName: string): File {
        const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
        return file;
    }

    private static resizeImage$(image: HTMLImageElement, 
      maxWidth: number = ImgUtil.DEFAULT_WIDTH_TO_RESIZE, 
      maxHeight: number = ImgUtil.DEFAULT_HEIGHT_TO_RESIZE
  ): Observable<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return new Observable(observer => {
      if (!ctx) {
        observer.error("Failed to get canvas context")
        observer.complete()
      }
  
      // Calculate the new dimensions
      let width = image.width;
      let height = image.height;

      if (width >= height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
  
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
    //   Draw the image
      ctx!.drawImage(image, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          observer.next(blob)
          observer.complete()
        } else {
          observer.error('Failed to convert canvas to blob')
          observer.complete()
        }
      }, 'image/jpeg'); // You can use other formats like 'image/png'

    })
  }
    
    public static blobToBase64$(blob: Blob): Observable<string> {
      return new Observable((observer) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = this.arrayBufferToBase64(reader.result)
          observer.next(result)
          observer.complete()
        }
        reader.onerror = (error) => {
          observer.error(error)
        }
        reader.readAsDataURL(blob)
      })
    }

      private static arrayBufferToBase64(buffer: string | ArrayBuffer | null): string {
        if (buffer instanceof ArrayBuffer) {
            // Create a Uint8Array from the ArrayBuffer
            const bytes = new Uint8Array(buffer);
            
            // Convert the Uint8Array to a string
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            
            // Encode the binary string to base64
            const base64 = btoa(binary);
            
            return base64;
        }
        return buffer || ''
    }


    public static saveBlobAsJpg(blobData: Blob, fileName: string) {
        // Create a new Blob object using the data
        const blob = new Blob([blobData], { type: 'image/jpeg' });
    
        // Create a link element
        const link = document.createElement('a');
        
        // Create a URL for the Blob and set it as the href attribute
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        
        // Set the download attribute with a filename
        link.download = fileName;
        
        // Append the link to the body
        document.body.appendChild(link);
        
        // Programmatically click the link to trigger the download
        link.click();
        
        // Remove the link from the document
        document.body.removeChild(link);
        
        // Release the Blob URL
        window.URL.revokeObjectURL(url);
      }

      public static prepareImages(fireImgSets: FireImgSet[]): Images {
        const images: Images = {
            bg: []
        }
        fireImgSets.forEach((imgSet) => {
            if (this.isAvatar(imgSet)) {
                images.avatar = imgSet
            }
            if (this.isBg(imgSet)){
                images.bg?.push(imgSet)
            }

        })
        return images
      }

      private static isAvatar(fireImg: FireImgSet): boolean {
        return fireImg.name === 'avatar'
      }

      private static isBg(fireImg: FireImgSet): boolean {
        return fireImg.name.includes('bg-')
      }
}