using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.AD;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.AD;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.AD
{
    public interface IConfigTemplateService : IGenericService<TblAdConfigTemplate, ConfigTemplateDto>
    {
        Task<IList<ConfigTemplateDto>> GetAll(BaseMdFilter filter);
        Task<PagedResponseDto> Search(BaseFilter filter);
    }

    public class ConfigTemplateService(AppDbContext dbContext, IMapper mapper) : GenericService<TblAdConfigTemplate, ConfigTemplateDto>(dbContext, mapper), IConfigTemplateService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblAdConfigTemplate.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                    x.Type.Contains(filter.KeyWord));
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
        public async Task<IList<ConfigTemplateDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblAdConfigTemplate.AsQueryable();
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await base.GetAllMd(query, filter);
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
