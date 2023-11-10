using System.Drawing;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Stripe;

namespace API.Services
{
    public class ImageService
    {
        // this service should be registered inside the Program.cs
        private readonly Cloudinary _cloudinary;
        public ImageService(IConfiguration config)
        {
            CloudinaryDotNet.Account account = new CloudinaryDotNet.Account
            (
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
        {
            // uploading image to Cloudinary
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream)
                };
                // upload it to our account (using the _cloudinary)
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            // result with error obj if failed, or url to access the image + PublicId to refer to it inside Cloudinary if we need to modify or delete this image
            return uploadResult;
        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            // delete the image on Cloudinary using its publicId
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParams);

            return result;
        }
    }
}