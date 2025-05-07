// EquipDocService.cs
using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Services;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipDocService : IGenericService<TblMdEquipDoc, EquipDocDto>
    {
        Task<EquipDocDto> UploadDocumentAsync(IFormFile file, string equnr, string docType = null);
        Task<IList<EquipDocDto>> GetByEqunrAsync(string equnr);
        Task<bool> DeleteDocumentAsync(string id);
    }

    public class EquipDocService : GenericService<TblMdEquipDoc, EquipDocDto>, IEquipDocService
    {
        private readonly IWebHostEnvironment _environment;

        public EquipDocService(AppDbContext dbContext, IMapper mapper, IWebHostEnvironment environment)
            : base(dbContext, mapper)
        {
            _environment = environment;
        }

        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipDoc.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Equnr.Contains(filter.KeyWord) ||
                                           x.Doctype.Contains(filter.KeyWord) ||
                                           x.Filetype.Contains(filter.KeyWord) ||
                                           x.Path.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query, filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<EquipDocDto> UploadDocumentAsync(IFormFile file, string equnr, string docType = null)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File không hợp lệ");

                // Đảm bảo equnr không chứa ký tự không hợp lệ
                var sanitizedPrefix = CleanFileName(equnr);

                // Tạo đường dẫn thư mục
                var now = DateTime.Now;
                var folderPath = Path.Combine("Uploads/Files", now.Year.ToString(),
                                             now.Month.ToString("00"),
                                             now.Day.ToString("00"));

                var fullFolderPath = Path.Combine(_environment.ContentRootPath, folderPath);

                if (!Directory.Exists(fullFolderPath))
                {
                    Directory.CreateDirectory(fullFolderPath);
                }

                // Tạo tên file an toàn bằng cách thêm GUID để tránh trùng lặp
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{sanitizedPrefix}_{Guid.NewGuid().ToString()}{fileExtension}";

                // Đảm bảo đường dẫn file an toàn
                var filePath = Path.Combine(fullFolderPath, fileName);

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Tạo entity để lưu vào database
                var entity = new TblMdEquipDoc
                {
                    Id = Guid.NewGuid().ToString(),
                    Equnr = equnr,
                    Doctype = fileExtension.TrimStart('.'),
                    Filetype = fileExtension.TrimStart('.'),
                    Filesize = (int)file.Length,
                    Filename = file.FileName,
                    Path = Path.Combine(folderPath, fileName).Replace("\\", "/"),
                    IsActive = true
                };

                await _dbContext.TblMdEquipDoc.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<EquipDocDto>(entity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<IList<EquipDocDto>> GetByEqunrAsync(string equnr)
        {
            try
            {
                var entities = await _dbContext.TblMdEquipDoc
                    .Where(x => x.Equnr == equnr)
                    .ToListAsync();

                return _mapper.Map<IList<EquipDocDto>>(entities);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<bool> DeleteDocumentAsync(string id)
        {
            try
            {
                var entity = await _dbContext.TblMdEquipDoc.FindAsync(id);
                if (entity == null)
                {
                    Status = false;
                    MessageObject.Code = "0000";
                    return false;
                }

                // Xóa file
                if (!string.IsNullOrEmpty(entity.Path))
                {
                    var fullPath = Path.Combine(_environment.ContentRootPath, entity.Path);
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }

                _dbContext.TblMdEquipDoc.Remove(entity);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return false;
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
    }
}