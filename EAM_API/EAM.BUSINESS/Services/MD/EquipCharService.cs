using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipCharService : IGenericService<TblMdEquipChar, EquipCharDto>
    {
        Task<List<EquipClassDto>> Insert(List<EquipClassDto> dto);
        Task<byte[]> Export(BaseMdFilter filter);
        Task<List<EquipClassDto>> GetDetail(string equnr);
    }
    
    public class EquipCharService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquipChar, EquipCharDto>(dbContext, mapper), IEquipCharService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipChar.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Equnr.Contains(filter.KeyWord) || 
                                           x.Class.Contains(filter.KeyWord) ||
                                           x.Atnam.Contains(filter.KeyWord) ||
                                           x.Value.Contains(filter.KeyWord));
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
        public async Task<byte[]> Export(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipChar.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Class.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                var data = await base.GetAllMd(query, filter);
                int i = 1;
                data.ForEach(x =>
                {
                    x.OrdinalNumber = i++;
                });
                return await ExportExtension.ExportToExcel(data);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<List<EquipClassDto>> GetDetail(string equnr)
        {
            try
            {
                var entity = await _dbContext.TblMdEquipClass.Where(x => x.Equnr == equnr).ToListAsync();
                if (entity == null)
                {
                    Status = false;
                    return null;
                }

                return _mapper.Map<List<EquipClassDto>>(entity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public async Task<List<EquipClassDto>> Insert(List<EquipClassDto> dto)
        {
            try
            {
                foreach (var d in dto)
                {
                    var e = _mapper.Map<TblMdEquipClass>(d);
                    if(e.Id == "A")
                    {
                        e.Id = Guid.NewGuid().ToString();
                        e.Equnr = e.Equnr.Trim();
                        _dbContext.TblMdEquipClass.Add(e);
                    }
                    else
                    {
                        _dbContext.TblMdEquipClass.Update(e);
                    }
                }
                await _dbContext.SaveChangesAsync();

                return new List<EquipClassDto>();
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