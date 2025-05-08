using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiService : IGenericService<TblTranNoti, NotiDto>
    {
        Task<string> GetLastQmnum();
        Task<string> GenerateQmnum(string qmart);
    }
    
    public class NotiService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNoti, NotiDto>(dbContext, mapper), INotiService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) || 
                                        x.Qmtxt.Contains(filter.KeyWord) ||
                                        x.Iwerk.Contains(filter.KeyWord) ||
                                        x.Aufnr.Contains(filter.KeyWord) ||
                                        x.Equnr.Contains(filter.KeyWord));
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

        public async Task<string> GetLastQmnum()
        {
            try
            {
                var lastNoti = await _dbContext.TblTranNoti
                    .OrderByDescending(x => x.Qmnum)
                    .FirstOrDefaultAsync();
                
                return lastNoti?.Qmnum?.Trim() ?? "0";
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return "0";
            }
        }

        // Generate qmnum based on qmart type and count of existing records
        public async Task<string> GenerateQmnum(string qmart)
        {
            try
            {
                // Get sequence from notitype table based on qmart
                var notiType = await _dbContext.TblMdNotiType
                    .Where(nt => nt.Code == qmart)
                    .FirstOrDefaultAsync();

                if (notiType == null || !notiType.Sequence.HasValue)
                {
                    Status = false;
                    MessageObject.Message = $"Cannot find sequence for notification type: {qmart}";
                    return null;
                }

                // Get base sequence value
                int baseSequence = notiType.Sequence.Value;

                // Count existing notifications with the same qmart
                int existingCount = await _dbContext.TblTranNoti
                    .Where(n => n.Qmart == qmart)
                    .CountAsync();

                // Calculate new qmnum
                int newQmnum = baseSequence + existingCount;

                // Return as string
                return newQmnum.ToString();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public override async Task<NotiDto> Add(IDto dto)
        {
            try
            {
                // Cast to NotiDto
                var notiDto = dto as NotiDto;
                if (notiDto == null)
                {
                    Status = false;
                    MessageObject.Message = "Invalid DTO type";
                    return null;
                }

                // Generate qmnum based on qmart
                if (string.IsNullOrEmpty(notiDto.Qmnum) && !string.IsNullOrEmpty(notiDto.Qmart))
                {
                    notiDto.Qmnum = await GenerateQmnum(notiDto.Qmart);
                    
                    if (notiDto.Qmnum == null)
                    {
                        // Failed to generate qmnum
                        Status = false;
                        return null;
                    }
                }

                // Set creation date and time
                notiDto.Erdat = DateTime.Now;

                // Map and save entity
                var entity = _mapper.Map<TblTranNoti>(notiDto);
                await _dbContext.TblTranNoti.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<NotiDto>(entity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
    }
} 