using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Filter.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipService : IGenericService<TblMdEquip, EquipDto>
    {
        Task<PagedResponseDto> Search(EquipFilter filter);
        Task<byte[]> Export(BaseMdFilter filter);
        Task<List<EquipDto>> GetByEqunr(string equnr);
        Task<TblMdEquip> GetEquip(string equnr);
    }
    public class EquipService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquip, EquipDto>(dbContext, mapper), IEquipService
    {
        public async Task<TblMdEquip> GetEquip(string equnr)
        {
            try
            {
                return await _dbContext.TblMdEquip.FirstOrDefaultAsync(x => x.Equnr == equnr);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }

        }
        public async Task<PagedResponseDto> Search(EquipFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquip.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Eqktx.ToString().Contains(filter.KeyWord));
                }
                if (!string.IsNullOrWhiteSpace(filter.Equnr))
                {
                    query = query.Where(x => x.Equnr == filter.Equnr);
                }
                if (!string.IsNullOrWhiteSpace(filter.Tplnr))
                {
                    query = query.Where(x => x.Tplnr == filter.Tplnr);
                }

                if (!string.IsNullOrWhiteSpace(filter.Eqart))
                {
                    query = query.Where(x => x.Eqart == filter.Eqart);
                }
                if (!string.IsNullOrWhiteSpace(filter.StatAct))
                {
                    query = query.Where(x => x.StatAct == filter.StatAct);
                }

                if (!string.IsNullOrWhiteSpace(filter.StatusTh))
                {
                    query = query.Where(x => x.StatusTh == filter.StatusTh);
                }
                if (!string.IsNullOrWhiteSpace(filter.Eqtyp))
                {
                    query = query.Where(x => x.Eqtyp == filter.Eqtyp);
                }

                if (!string.IsNullOrWhiteSpace(filter.Arbpl))
                {
                    query = query.Where(x => x.Arbpl == filter.Arbpl);
                }
                if (!string.IsNullOrWhiteSpace(filter.Iwerk))
                {
                    query = query.Where(x => x.Iwerk == filter.Iwerk);
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
        //public async Task<byte[]> Export(BaseMdFilter filter)
        //{
        //    try
        //    {
        //        var query = _dbContext.TblMdEquip.AsQueryable();
        //        if (!string.IsNullOrWhiteSpace(filter.KeyWord))
        //        {
        //            query = query.Where(x => x.Class.Contains(filter.KeyWord));
        //        }
        //        if (filter.IsActive.HasValue)
        //        {
        //            query = query.Where(x => x.IsActive == filter.IsActive);
        //        }
        //        var data = await base.GetAllMd(query, filter);
        //        int i = 1;
        //        data.ForEach(x =>
        //        {
        //            x.OrdinalNumber = i++;
        //        });
        //        return await ExportExtension.ExportToExcel(data);
        //    }
        //    catch (Exception ex)
        //    {
        //        Status = false;
        //        Exception = ex;
        //        return null;
        //    }
        //}
        public async Task<byte[]> Export(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquip.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Eqktx.Contains(filter.KeyWord) || x.Equnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }

                var equipList = await query.ToListAsync();
                var data = _mapper.Map<List<EquipDto>>(equipList);

                var plantList = await _dbContext.TblMdPlant.ToListAsync();
                var flocList = await _dbContext.TblMdFloc.ToListAsync();
                var eqCatList = await _dbContext.TblMdEqCat.ToListAsync();
                var eqGroupList = await _dbContext.TblMdEqGroup.ToListAsync();

                for (int i = 0; i < data.Count; i++)
                {
                    data[i].OrdinalNumber = i + 1;

                    var plant = plantList.FirstOrDefault(p => p.Iwerk == equipList[i].Iwerk);
                    data[i].IwerkText = plant?.IwerkTxt;

                    var floc = flocList.FirstOrDefault(f => f.Tplnr == equipList[i].Tplnr);
                    data[i].TplnrText = floc?.Descript;

                    var eqCat = eqCatList.FirstOrDefault(c => c.Eqtyp == equipList[i].Eqtyp);
                    data[i].EqtypText = eqCat?.EqtypTxt;

                    var eqGroup = eqGroupList.FirstOrDefault(g => g.Eqart == equipList[i].Eqart);
                    data[i].EqartText = eqGroup?.EqartTxt;
                }

                return await ExportExtension.ExportToExcel(data);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<List<EquipDto>> GetByEqunr(string equnr)
        {
            try
            {
                var entity = await _dbContext.TblMdEquip.Where(x => x.Equnr == equnr).ToListAsync();
                if (entity == null)
                {
                    Status = false;
                    return null;
                }

                return _mapper.Map<List<EquipDto>>(entity);
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
