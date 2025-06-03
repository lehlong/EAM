using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Filter.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using NPOI.OpenXmlFormats.Dml;
using NPOI.SS.Formula.Functions;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface ITranEqCounterService : IGenericService<TblTranEqCounter, TranEqCounterDto>
    {
        Task Insert(TranEqCounterDto dto);
        Task<TblTranEqCounter> GetMaxPoint(string point, string equnr);
        Task<PagedResponseDto> Search(TranEqFilter filter);
    }

    public class TranEqCounterService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranEqCounter, TranEqCounterDto>(dbContext, mapper), ITranEqCounterService
    {
        public async Task Insert(TranEqCounterDto dto)
        {
            try
            {
                var count = _dbContext.TblTranEqCounter.Count().ToString("D12");
                dto.Mdocm = count;
                
                var lstPlan = await _dbContext.TblPlanH.Where(x => x.Cyctype == "P" && x.Equnr == dto.Equnr && x.Point == dto.Point).ToListAsync();

                var pmOrders = new Dictionary<string, int?>
                {
                    { "PM01", _dbContext.TblMdOrderType.Find("PM01").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM01") },
                    { "PM02", _dbContext.TblMdOrderType.Find("PM02").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM02") },
                    { "PM03", _dbContext.TblMdOrderType.Find("PM03").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM03") }
                };
                foreach (var p in lstPlan)
                {
                    
                    if (dto.Reading > p.NextCounter)
                    {
                        var code = pmOrders.ContainsKey(p.Auart) ? pmOrders[p.Auart].ToString() : string.Empty;
                        p.NextCounter = this.GetNextMaintenance(dto.Reading, p.Reading, p.Measvalue);
                        _dbContext.TblPlanH.Update(p);

                        _dbContext.TblTranOrder.Add(new TblTranOrder
                        {
                            Aufnr = code,
                            Iwerk = p.Iwerk,
                            Auart = p.Auart,
                            Ktext = p.Wptxt,
                            Tplnr = p.Tplnr,
                            Ingpr = p.Ingrp,
                            Arbpl = p.Arbpl,
                            Warpl = p.Warpl,
                            Equnr = p.Equnr,
                            Status = "01"
                        });

                        var lstEquip = _dbContext.TblPlanD.Where(x => x.Warpl == p.Warpl).ToList();
                        foreach (var _e in lstEquip)
                        {
                            _dbContext.TblTranOrderEq.Add(new TblTranOrderEq
                            {
                                Id = Guid.NewGuid().ToString(),
                                Aufnr = code,
                                Equnr = _e.Equnr,

                            });
                        }

                        var lstTaskList = _dbContext.TblMdTasklist.Where(x => x.Plnnr == p.Plnnr).ToList();
                        foreach (var t in lstTaskList)
                        {
                            _dbContext.TblTranOrderOperation.Add(new TblTranOrderOperation
                            {
                                Id = Guid.NewGuid().ToString(),
                                Aufnr = code,
                                Vornr = t.Vornr,
                                Ltxa1 = t.Ltxa1,
                            });
                        }

                        if (pmOrders.ContainsKey(p.Auart)) pmOrders[p.Auart]++;
                    }
                }

                var e = _mapper.Map<TblTranEqCounter>(dto);

                _dbContext.TblTranEqCounter.Add(e);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public decimal GetNextMaintenance(decimal? current, decimal? start, decimal? interval)
        {
            if (current == null || start == null || interval == null)
                return -1;

            if (current < start)
                return start.Value;

            decimal steps = Math.Ceiling(((decimal)(current - start + 1)) / interval.Value);
            return start.Value + steps * interval.Value;
        }



        public async Task<TblTranEqCounter> GetMaxPoint(string point, string equnr)
        {
            try
            {
                var p = await _dbContext.TblTranEqCounter.Where(x => x.Equnr == equnr && x.Point == point).ToListAsync();
                return p.Count() == 0 ? new TblTranEqCounter() : p.OrderByDescending(x => x.Reading).FirstOrDefault();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return new TblTranEqCounter();
            }
        }

        public async Task<PagedResponseDto> Search(TranEqFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranEqCounter.AsQueryable();

                if (!string.IsNullOrEmpty(filter.Equnr))
                {
                    query = query.Where(x => x.Equnr == filter.Equnr);
                }
                if (!string.IsNullOrEmpty(filter.Point))
                {
                    query = query.Where(x => x.Point == filter.Point);
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                if (filter.FromDate.HasValue)
                {
                    query = query.Where(x => x.IDate >= filter.FromDate);
                }
                if (filter.ToDate.HasValue)
                {
                    query = query.Where(x => x.IDate <= filter.ToDate);
                }
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);

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