using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Dtos.PLAN;
using EAM.BUSINESS.Model;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using EAM.CORE.Entities.PLAN;
using EAM.CORE.Entities.TRAN;
using MathNet.Numerics.Statistics.Mcmc;
using Microsoft.EntityFrameworkCore;
using NPOI.OpenXmlFormats.Wordprocessing;

namespace EAM.BUSINESS.Services.PLAN
{
    public interface IPlanHService : IGenericService<TblPlanH, PlanHDto>
    {
        Task<byte[]> Export(BaseMdFilter filter);
        Task Create(PlanHDto dto);
        Task GenarateOrder(FilterPlanModel filter);
        Task<string> GenarateCode(string m);
        Task<List<ResponsePlanModel>> SearchPlan(FilterPlanModel filter);
    }

    public class PlanHService(AppDbContext dbContext, IMapper mapper) : GenericService<TblPlanH, PlanHDto>(dbContext, mapper), IPlanHService
    {
        public async Task<string> GenarateCode(string m)
        {
            try
            {
                var sequence = m == "M1" ? 10000000 : m == "M2" ? 20000000 : 30000000;
                var count = await _dbContext.TblPlanH.Where(x => x.Mpgrp == m).CountAsync();
                return (sequence + count).ToString();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<List<ResponsePlanModel>> SearchPlan(FilterPlanModel filter)
        {
            try
            {
                var data = new List<ResponsePlanModel>();
                var h = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrEmpty(filter.Arbpl))
                {
                    h = h.Where(x => x.Arbpl == filter.Arbpl);
                }
                if (!string.IsNullOrEmpty(filter.Tplnr))
                {
                    h = h.Where(x => x.Tplnr == filter.Tplnr);
                }
                if (!string.IsNullOrEmpty(filter.Warpl))
                {
                    h = h.Where(x => x.Warpl.Contains(filter.Warpl));
                }
                var header = h.Where(x => x.Cyctype == "T").ToList();

                foreach (var i in header)
                {
                    var d = await _dbContext.TblPlanOrder.Where(x => x.Warpl == i.Warpl).ToListAsync();
                    if (filter.SchStart != null)
                    {
                        d = d.Where(x => x.Schstart < filter.SchStart).ToList();
                    }
                    foreach (var j in d)
                    {
                        data.Add(new ResponsePlanModel
                        {
                            Arbpl = i.Arbpl,
                            Warpl = i.Warpl,
                            Name = i.Wptxt,
                            Tplnr = i.Tplnr,
                            SchStart = j.Schstart,
                            IsComplete = j.Iscompled,
                            Aufnr = j.Aufnr
                        });
                    }
                }

                return data.OrderBy(x => x.Warpl).ThenBy(x => x.SchStart).ToList();
            }
            catch (Exception ex)
            {
                return new List<ResponsePlanModel>();
            }
        }
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Warpl.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                var data = await Paging(query.OrderByDescending(x => x.CreateDate), filter);
                foreach (var i in data.Data as IEnumerable<PlanHDto>)
                {
                    i.lstEquip = _dbContext.TblPlanD.Where(x => x.Warpl == i.Warpl).ToList();
                    i.lstPlanOrder = _dbContext.TblPlanOrder.Where(x => x.Warpl == i.Warpl).OrderByDescending(x => x.Schstart).ToList();
                }
                return data;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task Create(PlanHDto dto)
        {
            try
            {
                var entity = _mapper.Map<TblPlanH>(dto);
                _dbContext.TblPlanH.Add(entity);
                foreach (var i in dto.lstEquip)
                {
                    _dbContext.TblPlanD.Add(new TblPlanD
                    {
                        Id = Guid.NewGuid().ToString(),
                        Warpl = entity.Warpl,
                        Equnr = i.Equnr,
                        Eqart = i.Eqart,
                    });
                }
                foreach (var i in dto.lstPlanOrder)
                {
                    _dbContext.TblPlanOrder.Add(new TblPlanOrder
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = entity.Wptxt,
                        Warpl = entity.Warpl,
                        Schstart = i.Schstart,
                        Plnnr = i.Plnnr,
                        Cycle = i.Cycle,
                        Measure = i.Measure,
                        Tplnr = i.Tplnr,
                        Equnr = i.Equnr,
                        Reading = i.Reading,
                        Iscompled = false
                    });

                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
        public async Task<byte[]> Export(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Warpl.Contains(filter.KeyWord));
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

        public async Task GenarateOrder(FilterPlanModel filter)
        {
            try
            {
                var hQuery = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrEmpty(filter.Arbpl)) hQuery = hQuery.Where(x => x.Arbpl == filter.Arbpl);
                if (!string.IsNullOrEmpty(filter.Tplnr)) hQuery = hQuery.Where(x => x.Tplnr == filter.Tplnr);
                if (!string.IsNullOrEmpty(filter.Warpl)) hQuery = hQuery.Where(x => x.Warpl.Contains(filter.Warpl));
                var header = await hQuery.Where(x => x.Cyctype == "T").ToListAsync();

                var pmOrders = new Dictionary<string, int?>
                {
                    { "PM01", _dbContext.TblMdOrderType.Find("PM01").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM01") },
                    { "PM02", _dbContext.TblMdOrderType.Find("PM02").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM02") },
                    { "PM03", _dbContext.TblMdOrderType.Find("PM03").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM03") }
                };

                var planOrders = await _dbContext.TblPlanOrder
                                                 .Where(x => header.Select(h => h.Warpl).Contains(x.Warpl))
                                                 .ToListAsync();

                foreach (var i in header)
                {
                    var filteredPlanOrders = planOrders.Where(x => x.Warpl == i.Warpl && x.Iscompled == false);
                    if (filter.SchStart != null) filteredPlanOrders = filteredPlanOrders.Where(x => x.Schstart < filter.SchStart);

                    foreach (var _d in filteredPlanOrders)
                    {
                        var code = pmOrders.ContainsKey(i.Auart) ? pmOrders[i.Auart].ToString() : string.Empty;

                        _d.Iscompled = true;
                        _d.Aufnr = code;
                        _dbContext.TblPlanOrder.Update(_d);

                        _dbContext.TblTranOrder.Add(new TblTranOrder
                        {
                            Aufnr = code,
                            Iwerk = i.Iwerk,
                            Auart = i.Auart,
                            Ktext = i.Wptxt,
                            Tplnr = i.Tplnr,
                            Ingpr = i.Ingrp,
                            Arbpl = i.Arbpl,
                            Gstrs = _d.Schstart,
                            Warpl = i.Warpl,
                            Equnr = i.Equnr,
                            Status = "01"
                        });

                        if (i.Mptyp == "1")
                        {
                            var lstEquip = _dbContext.TblPlanD.Where(x => x.Warpl == i.Warpl).ToList();
                            foreach (var e in lstEquip)
                            {
                                _dbContext.TblTranOrderEq.Add(new TblTranOrderEq
                                {
                                    Id = Guid.NewGuid().ToString(),
                                    Aufnr = code,
                                    Equnr = e.Equnr,

                                });
                            }

                            var lstTaskList = _dbContext.TblMdTasklist.Where(x => x.Plnnr == i.Plnnr).ToList();
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
                        }
                        else
                        {
                            _dbContext.TblTranOrderEq.Add(new TblTranOrderEq
                            {
                                Id = Guid.NewGuid().ToString(),
                                Aufnr = code,
                                Equnr = i.Equnr,
                            });

                            var lstTaskList = _dbContext.TblMdTasklist.Where(x => x.Plnnr == _d.Plnnr).ToList();
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


                        }
                        if (pmOrders.ContainsKey(i.Auart)) pmOrders[i.Auart]++;
                    }
                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

    }
}