using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System.Net.NetworkInformation;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiCatalogService : IGenericService<TblTranNotiCatalog, NotiCatalogDto>
    {
        Task<List<NotiCatalogDto>> GetByQmnum(string qmnum);
        Task UpdateCatalog(List<TblTranNotiCatalog> data);
    }
    
    public class NotiCatalogService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNotiCatalog, NotiCatalogDto>(dbContext, mapper), INotiCatalogService
    {
        public async Task UpdateCatalog(List<TblTranNotiCatalog> data)
        {
            try
            {
                foreach(var i in data)
                {
                    if(i.Id == "A")
                    {
                        i.Id = Guid.NewGuid().ToString();
                        _dbContext.TblTranNotiCatalog.Add(i);
                    }
                    else
                    {
                        _dbContext.TblTranNotiCatalog.Update(i);
                    }
                }
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public async Task<List<NotiCatalogDto>> GetByQmnum(string qmnum)
        {
            try
            {
                var items = await _dbContext.TblTranNotiCatalog.Where(x => x.Qmnum == qmnum).ToListAsync();
                var result = _mapper.Map<List<NotiCatalogDto>>(items);
                return result;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNotiCatalog.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                       x.Objpart.Contains(filter.KeyWord) ||
                                       x.TypeCode.Contains(filter.KeyWord) ||
                                       x.TypeTxt.Contains(filter.KeyWord) ||
                                       x.CauseCode.Contains(filter.KeyWord) ||
                                       x.CauseTxt.Contains(filter.KeyWord) ||
                                       x.TaskCode.Contains(filter.KeyWord) ||
                                       x.TaskTxt.Contains(filter.KeyWord) ||
                                       x.ActCode.Contains(filter.KeyWord) ||
                                       x.ActTxt.Contains(filter.KeyWord));
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
    }
} 