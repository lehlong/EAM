using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Services
{
    public interface IFileService
    {
        Task<(string Path, string OriginalFilename, string FileType, int FileSize)> SaveFileAsync(IFormFile file, string folder, string prefix);
        Task DeleteFileAsync(string path);
    }

    public class FileService : IFileService
    {
        private readonly string _rootPath;

        public FileService(IWebHostEnvironment environment)
        {
            _rootPath = environment.ContentRootPath;
        }

        public async Task<(string Path, string OriginalFilename, string FileType, int FileSize)> SaveFileAsync(IFormFile file, string folder, string prefix)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File không hợp lệ");

            // Đảm bảo prefix không chứa ký tự không hợp lệ
            prefix = CleanFileName(prefix);

            var now = DateTime.Now;
            var folderPath = Path.Combine(folder, now.Year.ToString(),
                                         now.Month.ToString("00"),
                                         now.Day.ToString("00"));

            var fullFolderPath = Path.Combine(_rootPath, folderPath);

            if (!Directory.Exists(fullFolderPath))
            {
                Directory.CreateDirectory(fullFolderPath);
            }

            // Tạo tên file an toàn bằng cách thêm GUID để tránh trùng lặp
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{prefix}_{Guid.NewGuid().ToString()}{fileExtension}";

            // Đảm bảo đường dẫn file an toàn
            var filePath = Path.Combine(fullFolderPath, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về thông tin file
                return (
                    Path: Path.Combine(folderPath, fileName).Replace("\\", "/"),
                    OriginalFilename: file.FileName,
                    FileType: fileExtension.TrimStart('.'),
                    FileSize: (int)file.Length
                );
            }
            catch (Exception ex)
            {
                // Log lỗi và ném lại exception
                Console.WriteLine($"Error saving file: {ex.Message}");
                throw;
            }
        }

        // Hàm loại bỏ các ký tự không hợp lệ trong tên file
        private string CleanFileName(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return "file";

            // Loại bỏ các ký tự không hợp lệ
            char[] invalidChars = Path.GetInvalidFileNameChars();
            foreach (char c in invalidChars)
            {
                fileName = fileName.Replace(c, '_');
            }

            return fileName;
        }

        public async Task DeleteFileAsync(string path)
        {
            if (string.IsNullOrEmpty(path))
                return;

            var fullPath = Path.Combine(_rootPath, path);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}