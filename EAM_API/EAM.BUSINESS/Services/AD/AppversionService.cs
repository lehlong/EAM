using AutoMapper;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.AD;
using EAM.CORE;
using EAM.CORE.Entities.AD;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.AD
{
    public interface IAppVersionService : IGenericService<TblAdAppVersion, AppVersionDto>
    {
        Task<AppVersionDto> GetCurrentVersion();
    }
    public class AppVersionService(AppDbContext dbContext, IMapper mapper) : GenericService<TblAdAppVersion, AppVersionDto>(dbContext, mapper), IAppVersionService
    {
        public async Task<AppVersionDto> GetCurrentVersion()
        {
            var data = await _dbContext.TblAdAppVersion.OrderByDescending(x => x.VersionCode).FirstOrDefaultAsync();

            return _mapper.Map<AppVersionDto>(data);
        }
    }
}
