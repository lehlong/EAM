using AutoMapper;
using ClosedXML.Excel;
using Common;
using DocumentFormat.OpenXml.Office2021.DocumentTasks;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.PLAN;
using EAM.BUSINESS.Filter.PLAN;
using EAM.BUSINESS.Model;
using EAM.CORE;
using EAM.CORE.Entities.PLAN;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace EAM.BUSINESS.Services.PLAN
{
    public interface IPlanHService : IGenericService<TblPlanH, PlanHDto>
    {
        Task<byte[]> Export(BaseMdFilter filter);
        Task<string> ExportReport(PlanFilter filter);
        Task Create(PlanHDto dto);
        Task GenarateOrder(FilterPlanModel filter);
        Task GenarateOrderSelect(List<string> ids);
        Task<string> GenarateCode(string m);
        Task<List<ResponsePlanModel>> SearchPlan(FilterPlanModel filter);
        Task<PagedResponseDto> Search(PlanFilter filter);
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
        public async Task<PagedResponseDto> Search(PlanFilter filter)
        {
            try
            {
                var query = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Warpl.ToString().Contains(filter.KeyWord));
                }
                if (!string.IsNullOrWhiteSpace(filter.Ingrp))
                {
                    query = query.Where(x => x.Ingrp == filter.Ingrp);
                }
              
                if (!string.IsNullOrWhiteSpace(filter.Tplnr))
                {
                    query = query.Where(x => x.Tplnr == filter.Tplnr);
                }

                if (!string.IsNullOrWhiteSpace(filter.Mtgrp))
                {
                    query = query.Where(x => x.Mpgrp == filter.Mtgrp);
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                if (!string.IsNullOrEmpty(filter.SchStart.ToString()))
                {
                    var lstOrder = await _dbContext.TblPlanOrder.Where(x => x.Schstart.Value.Year == filter.SchStart).Select(x => x.Warpl).ToListAsync();
                    query = query.Where(x => lstOrder.Contains(x.Warpl));
                }
                if (!string.IsNullOrEmpty(filter.Eqart))
                {
                    var lstEquip = _dbContext.TblMdEquip.Where(x => x.Eqart == filter.Eqart).Select(x => x.Equnr).ToList();
                    var lstWarpl = _dbContext.TblPlanD.Where(x => lstEquip.Contains(x.Equnr)).Select(x => x.Warpl).ToList();
                    query = query.Where(x => lstWarpl.Contains(x.Warpl));
                }
                return await Paging(query.OrderByDescending(x => x.Warpl), filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public async Task<string> ExportReport(PlanFilter filter)
        {
            try
            {
                string templatePath = Path.Combine("TemplateExcel", "BaoCaoKeHoachBTBD.xlsx");
                DateTime now = DateTime.Now;
                string exportFolder = Path.Combine("ExportFiles",
                                                   now.Year.ToString(),
                                                   now.Month.ToString("D2"),
                                                   now.Day.ToString("D2"));
                Directory.CreateDirectory(exportFolder);
                string exportFileName = "BaoCaoKeHoachBTBD.xlsx";
                string exportPath = Path.Combine(exportFolder, exportFileName);

                var query = _dbContext.TblPlanH.AsQueryable();
                
                if (!string.IsNullOrWhiteSpace(filter.Ingrp))
                {
                    query = query.Where(x => x.Ingrp == filter.Ingrp);
                }

                if (!string.IsNullOrWhiteSpace(filter.Tplnr))
                {
                    query = query.Where(x => x.Tplnr == filter.Tplnr);
                }

                if (!string.IsNullOrWhiteSpace(filter.Mtgrp))
                {
                    query = query.Where(x => x.Mpgrp == filter.Mtgrp);
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                if (!string.IsNullOrEmpty(filter.SchStart.ToString()))
                {
                    var lstOrder = await _dbContext.TblPlanOrder.Where(x => x.Schstart.Value.Year == filter.SchStart).Select(x => x.Warpl).ToListAsync();
                    query = query.Where(x => lstOrder.Contains(x.Warpl));
                }
                if (!string.IsNullOrEmpty(filter.Eqart))
                {
                    var lstEquip = _dbContext.TblMdEquip.Where(x => x.Eqart == filter.Eqart).Select(x => x.Equnr).ToList();
                    var lstWarpl= _dbContext.TblPlanD.Where(x => lstEquip.Contains(x.Equnr)).Select(x => x.Warpl).ToList();
                    query = query.Where(x => lstWarpl.Contains(x.Warpl));
                }

                var header = query.Where(x => x.Cyctype == "T").ToList();

                using (var workbook = new XLWorkbook(templatePath))
                {
                    var worksheet = workbook.Worksheet(1);

                    worksheet.Cell("H5").Value = filter.SchStart;
                    worksheet.Cell("H6").Value = string.IsNullOrEmpty(filter.Ingrp) ? "Tất cả" : _dbContext.TblMdPlgrp.Find(filter.Ingrp)?.IngrpTxt;
                    worksheet.Cell("H7").Value = string.IsNullOrEmpty(filter.Tplnr) ? "Tất cả" : _dbContext.TblMdFloc.Find(filter.Tplnr)?.Descript;
                    worksheet.Cell("H8").Value = string.IsNullOrEmpty(filter.Eqart) ? "Tất cả" : _dbContext.TblMdEqGroup.Find(filter.Eqart)?.EqartTxt;
                    worksheet.Cell("H9").Value = string.IsNullOrEmpty(filter.Mtgrp) ? "Tất cả" : filter.Mtgrp == "M1" ? "Kế hoạch bảo trì hàng năm" : filter.Mtgrp == "M2" ? "Kế hoạch hiệu chuẩn thiết bị" : "Nâng cấp tài sản";

                    var stt = 1;
                    var startRow = 13;
                    int currentRow = startRow;
                    foreach (var h in header)
                    {
                        var lstEquip = await _dbContext.TblPlanD.Where(x => x.Warpl == h.Warpl).ToListAsync();
                        if (lstEquip.Count() == 0) continue;
                        var lstOrder = await _dbContext.TblPlanOrder.Where(x => x.Warpl == h.Warpl && x.Schstart.Value.Year == filter.SchStart).ToListAsync();
                        if (lstOrder.Count() == 0) continue;

                        foreach(var e in lstEquip)
                        {
                            worksheet.Row(currentRow).InsertRowsAbove(1);
                            worksheet.Cell(currentRow, 1).Value = stt++;
                            worksheet.Cell(currentRow, 2).Value = _dbContext.TblMdFloc.Find(h.Tplnr)?.Descript;
                            worksheet.Cell(currentRow, 3).Value = e.Equnr;
                            worksheet.Cell(currentRow, 4).Value = _dbContext.TblMdEquip.Find(e.Equnr)?.Eqktx;
                            worksheet.Cell(currentRow, 5).Value = "";
                            worksheet.Cell(currentRow, 6).Value = h.Warpl;
                            worksheet.Cell(currentRow, 7).Value = h.Wptxt;
                            worksheet.Cell(currentRow, 8).Value = h.Cycle.ToString() + " - " + h.Cycunit == "D" ? "Ngày" : h.Cycunit == "W" ? "Tuần" : "Tháng";
                            worksheet.Cell(currentRow, 9).Value = lstOrder.Where(x => x.Iscompled == true).OrderByDescending(x => x.Schstart).FirstOrDefault()?.Schstart?.ToString("dd/MM/yyyy");
                            worksheet.Cell(currentRow, 10).Value = lstOrder.Where(x => x.Schstart.Value.Month == 1).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 11).Value = lstOrder.Where(x => x.Schstart.Value.Month == 2).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 12).Value = lstOrder.Where(x => x.Schstart.Value.Month == 3).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 13).Value = lstOrder.Where(x => x.Schstart.Value.Month == 4).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 14).Value = lstOrder.Where(x => x.Schstart.Value.Month == 5).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 15).Value = lstOrder.Where(x => x.Schstart.Value.Month == 6).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 16).Value = lstOrder.Where(x => x.Schstart.Value.Month == 7).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 17).Value = lstOrder.Where(x => x.Schstart.Value.Month == 8).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 18).Value = lstOrder.Where(x => x.Schstart.Value.Month == 9).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 19).Value = lstOrder.Where(x => x.Schstart.Value.Month == 10).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 20).Value = lstOrder.Where(x => x.Schstart.Value.Month == 12).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 21).Value = lstOrder.Where(x => x.Schstart.Value.Month == 12).Count() > 0 ? "o" : "x";
                            worksheet.Cell(currentRow, 22).Value = _dbContext.TblMdWc.Find(h.Arbpl)?.ArbplTxt;
                            currentRow++;
                        }

                    }
                    worksheet.Cell("A10").Value = $"Ngày giờ: {DateTime.Now.ToString("dd/MM/yyyy hh:mm")}";
                    workbook.SaveAs(exportPath);
                }

                return exportPath.Replace("\\", "/");

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
                            Id = j.Id,
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

        public async Task GenarateOrderSelect(List<string> ids)
        {
            try
            {
                var planOrders = await _dbContext.TblPlanOrder
                                                 .Where(x => ids.Contains(x.Id) && x.Iscompled == false)
                                                 .ToListAsync();
                var warplList = planOrders.Select(x => x.Warpl).Distinct().ToList();
                var header = await _dbContext.TblPlanH
                                             .Where(x => warplList.Contains(x.Warpl) && x.Cyctype == "T")
                                             .ToListAsync();
                var pmOrders = new Dictionary<string, int?>
        {
            { "PM01", _dbContext.TblMdOrderType.Find("PM01").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM01") },
            { "PM02", _dbContext.TblMdOrderType.Find("PM02").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM02") },
            { "PM03", _dbContext.TblMdOrderType.Find("PM03").Sequence + _dbContext.TblTranOrder.Count(x => x.Auart == "PM03") }
        };
                foreach (var i in header)
                {
                    var filteredPlanOrders = planOrders.Where(x => x.Warpl == i.Warpl);
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