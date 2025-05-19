using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderAttService : IGenericService<TblTranOrderAtt, OrderAttDto>
    {
        Task<OrderAttDto> UploadAttachmentAsync(IFormFile file, string Aufnr);
        Task<IList<OrderAttDto>> GetByAufnrAsync(string Aufnr);
        Task<bool> DeleteAttachmentAsync(string id);
    }
    
    public class OrderAttService : GenericService<TblTranOrderAtt, OrderAttDto>, IOrderAttService
    {
        private readonly IWebHostEnvironment _environment;

        public OrderAttService(AppDbContext dbContext, IMapper mapper, IWebHostEnvironment environment)
            : base(dbContext, mapper)
        {
            _environment = environment;
        }

        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrderAtt.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                       x.FileType.Contains(filter.KeyWord) ||
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

        public async Task<OrderAttDto> UploadAttachmentAsync(IFormFile file, string Aufnr)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File không h?p l?");

                var sanitizedPrefix = CleanFileName(Aufnr);

                var now = DateTime.Now;
                var folderPath = Path.Combine("Uploads/Orders", now.Year.ToString(),
                                             now.Month.ToString("00"),
                                             now.Day.ToString("00"));

                var fullFolderPath = Path.Combine(_environment.ContentRootPath, folderPath);

                if (!Directory.Exists(fullFolderPath))
                {
                    Directory.CreateDirectory(fullFolderPath);
                }

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{sanitizedPrefix}_{Guid.NewGuid().ToString()}{fileExtension}";

                var filePath = Path.Combine(fullFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var entity = new TblTranOrderAtt
                {
                    Id = Guid.NewGuid().ToString(),
                    Aufnr = Aufnr,
                    FileType = fileExtension.TrimStart('.'),
                    FileSize = (int)file.Length,
                    Path = Path.Combine(folderPath, fileName).Replace("\\", "/"),
                    IsActive = true
                };

                await _dbContext.TblTranOrderAtt.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<OrderAttDto>(entity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<IList<OrderAttDto>> GetByAufnrAsync(string aufnr)
        {
            try
            {
                var entities = await _dbContext.TblTranOrderAtt
                    .Where(x => x.Aufnr == aufnr)
                    .ToListAsync();

                return _mapper.Map<IList<OrderAttDto>>(entities);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<bool> DeleteAttachmentAsync(string id)
        {
            try
            {
                var entity = await _dbContext.TblTranOrderAtt.FindAsync(id);
                if (entity == null)
                {
                    Status = false;
                    MessageObject.Code = "0000";
                    return false;
                }
                if (!string.IsNullOrEmpty(entity.Path))
                {
                    var fullPath = Path.Combine(_environment.ContentRootPath, entity.Path);
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }

                _dbContext.TblTranOrderAtt.Remove(entity);
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

        private string CleanFileName(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return "file";
            char[] invalidChars = Path.GetInvalidFileNameChars();
            foreach (char c in invalidChars)
            {
                fileName = fileName.Replace(c, '_');
            }

            return fileName;
        }
    }
}
