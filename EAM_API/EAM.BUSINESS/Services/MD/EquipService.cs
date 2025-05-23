﻿using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Filter.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipService : IGenericService<TblMdEquip, EquipDto>
    {
        Task<PagedResponseDto> Search(EquipFilter filter);
        Task<byte[]> Export(BaseMdFilter filter);
        Task<List<EquipDto>> GetByEqunr(string equnr);
    }
    public class EquipService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquip, EquipDto>(dbContext, mapper), IEquipService
    {
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
                    query = query.Where(x => x.EqUnr == filter.Equnr);
                }
                if (!string.IsNullOrWhiteSpace(filter.Tplnr))
                {
                    query = query.Where(x => x.Tplnr == filter.Tplnr);
                }

                if (!string.IsNullOrWhiteSpace(filter.Eqart))
                {
                    query = query.Where(x => x.Eqart == filter.Eqart);
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
                var query = _dbContext.TblMdEquip.AsQueryable();
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

        public async Task<List<EquipDto>> GetByEqunr(string equnr)
        {
            try
            {
                var entity = await _dbContext.TblMdEquip.Where(x => x.EqUnr == equnr).ToListAsync();
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
