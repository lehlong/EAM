﻿using AutoMapper;
using ClosedXML.Excel;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Filter.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using NPOI.OpenXmlFormats.Wordprocessing;
using NPOI.SS.Formula.Functions;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderService : IGenericService<TblTranOrder, OrderDto>
    {
        Task<PagedResponseDto> Search(NotiFilter filter);
        Task<string> ExportExcel(string aufnr);
        Task<string> InsertOrder(OrderDto data);
        Task UpdateOrder(OrderDto data);
        Task UpdateListOrder(List<OrderDto> data);
        Task<OrderDto> GetDetail(string code);
        Task<PagedResponseDto> SearchPlanOrder(OrderFilter filter);
    }

    public class OrderService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrder, OrderDto>(dbContext, mapper), IOrderService
    {
        public async Task<string> ExportExcel(string aufnr)
        {
            try
            {
                var order = await _dbContext.TblTranOrder.FindAsync(aufnr);
                var orderTask = await _dbContext.TblTranOrderOperation
                    .Where(x => x.Aufnr == aufnr).ToListAsync();
                var orderVt = await _dbContext.TblTranOrderVt
                    .Where(x => x.Aufnr == aufnr && x.Category == "S").ToListAsync();

                string templatePath = Path.Combine("TemplateExcel", "PhieuBaoDuongSuaChua.xlsx");
                DateTime now = DateTime.Now;
                string exportFolder = Path.Combine("ExportFiles", now.Year.ToString(), now.Month.ToString("D2"), now.Day.ToString("D2"));
                Directory.CreateDirectory(exportFolder);
                string exportFileName = "PhieuBaoDuongSuaChua.xlsx";
                string exportPath = Path.Combine(exportFolder, exportFileName);

                using (var workbook = new XLWorkbook(templatePath))
                {
                    var worksheet = workbook.Worksheet(1);
                    worksheet.Cell("F1").Value = $"Số lệnh: {order.Aufnr}";
                    if (!string.IsNullOrEmpty(order.Equnr))
                    {
                        worksheet.Cell("C7").Value = _dbContext.TblMdEquip.Find(order.Equnr)?.Eqktx;
                    }
                    worksheet.Cell("C8").Value = _dbContext.TblMdWc.Find(order.Arbpl)?.ArbplTxt;
                    worksheet.Cell("C9").Value = _dbContext.TblMdWc.Find(order.Arbpl)?.ArbplTxt;
                    worksheet.Cell("E6").Value = $"Từ ngày {order.Gstrs?.ToString("dd/MM/yyyy")} đến {order.Gltrs?.ToString("dd/MM/yyyy")}";
                    worksheet.Cell("E9").Value = order.Gltrs?.ToString("dd/MM/yyyy");
                    worksheet.Cell("E8").Value = $"{order.StaffSc} - {_dbContext.TblAdAccount.Find(order.StaffSc)?.FullName}";
                    worksheet.Cell("A12").Value = order.Ktext;

                    int rowTaskStart = 18;
                    int currentRow = rowTaskStart;
                    int taskStt = 1;

                    foreach (var task in orderTask)
                    {
                        worksheet.Row(currentRow).InsertRowsAbove(1);
                        worksheet.Cell(currentRow, 1).Value = taskStt++;
                        worksheet.Range(currentRow, 2, currentRow, 5).Merge();
                        var mergedCell = worksheet.Cell(currentRow, 2);
                        mergedCell.Value = task.Ltxa1;
                        mergedCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                        mergedCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

                        if (task.IsWork == true)
                        {
                            worksheet.Cell(currentRow, 6).Value = "X";
                        }
                        else
                        {
                            worksheet.Cell(currentRow, 7).Value = "X";
                        }

                        currentRow++;
                    }

                    int rowVtTaskStart = currentRow + 3;
                    int rowVtCurrent = rowVtTaskStart;
                    var vtStt = 1;
                    foreach (var vt in orderVt)
                    {
                        worksheet.Row(rowVtCurrent).InsertRowsAbove(1);
                        worksheet.Cell(rowVtCurrent, 1).Value = vtStt++;
                        worksheet.Cell(rowVtCurrent, 2).Value = vt.Matnr;

                        var maktxCell = worksheet.Cell(rowVtCurrent, 3);
                        maktxCell.Value = vt.Maktx;
                        maktxCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                        maktxCell.Style.Alignment.WrapText = true;

                        worksheet.Cell(rowVtCurrent, 4).Value = vt.Menge;
                        worksheet.Cell(rowVtCurrent, 5).Value = vt.Meins;
                        worksheet.Cell(rowVtCurrent, 6).Value = vt.Lgort;
                        rowVtCurrent++;
                    }
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



        public async Task<PagedResponseDto> Search(NotiFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrder.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Ktext.Contains(filter.KeyWord) ||
                                      x.Iwerk.Contains(filter.KeyWord) ||
                                      x.Auart.Contains(filter.KeyWord) ||
                                      x.Qmnum.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Tplnr.Contains(filter.KeyWord));
                }
                if (!string.IsNullOrEmpty(filter.Equnr))
                {
                    query = query.Where(x => x.Equnr == filter.Equnr);
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                query = query.Where(x => string.IsNullOrEmpty(x.Warpl) && !string.IsNullOrEmpty(x.Qmnum));
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<PagedResponseDto> SearchPlanOrder(OrderFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrder.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Ktext.Contains(filter.KeyWord) ||
                                      x.Iwerk.Contains(filter.KeyWord) ||
                                      x.Auart.Contains(filter.KeyWord) ||
                                      x.Qmnum.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Tplnr.Contains(filter.KeyWord));
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
                if (!string.IsNullOrWhiteSpace(filter.Ingpr))
                {
                    query = query.Where(x => x.Ingpr == filter.Ingpr);
                }
                if (!string.IsNullOrWhiteSpace(filter.Status))
                {
                    query = query.Where(x => x.Status == filter.Status);
                }
                if (filter.FromDate.HasValue)
                {
                    query = query.Where(x => x.Gltrs >= filter.FromDate);
                }
                if (filter.ToDate.HasValue)
                {
                    query = query.Where(x => x.Gltrs <= filter.ToDate);
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                query = query.Where(x => !string.IsNullOrEmpty(x.Warpl) && string.IsNullOrEmpty(x.Qmnum));
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<string> InsertOrder(OrderDto data)
        {
            try
            {
                var orderType = _dbContext.TblMdOrderType.Find(data.Auart);
                var code = orderType.Sequence + _dbContext.TblTranOrder.Where(x => x.Auart == data.Auart).Count() ?? 0;
                data.Aufnr = code.ToString();
                var entity = _mapper.Map<TblTranOrder>(data);
                _dbContext.TblTranOrder.Add(entity);

                var noti = _dbContext.TblTranNoti.Find(data.Qmnum);
                noti.StatAct = "07";
                noti.Aufnr = code.ToString();
                _dbContext.TblTranNoti.Update(noti);
                var newOrderEq = new TblTranOrderEq
                {
                    Id = Guid.NewGuid().ToString(),
                    Aufnr = data.Aufnr,
                    Equnr = data.Equnr,
                    IsActive = true,
                };
                await _dbContext.TblTranOrderEq.AddAsync(newOrderEq);

                await _dbContext.SaveChangesAsync();

                return code.ToString();

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return "0";
            }
        }

        public async Task UpdateOrder(OrderDto data)
        {
            try
            {
                var entity = _mapper.Map<TblTranOrder>(data);
                _dbContext.TblTranOrder.Update(entity);
                if (!string.IsNullOrEmpty(data.Qmnum))
                {
                    var noti = _dbContext.TblTranNoti.Find(data.Qmnum);
                    if (data.Status == "07" || data.Status == "04")
                    {                       
                       noti.StatAct = data.Status;                     
                    }
                    noti.Lvtsd = data.LoaivtSd;
                    noti.Htbtbd = data.HtBtbd;
                    _dbContext.TblTranNoti.Update(noti);
                }


                if (data.lstCatalog != null)
                {
                    foreach (var i in data.lstCatalog)
                    {
                        if (i.Id == "A")
                        {
                            i.Id = Guid.NewGuid().ToString();
                            _dbContext.TblTranNotiCatalog.Add(i);
                        }
                        else
                        {
                            _dbContext.TblTranNotiCatalog.Update(i);
                        }
                    }
                }
                if (data.lstVt != null)
                {
                    foreach (var i in data.lstVt)
                    {
                        if (i.Id == "A")
                        {
                            i.Id = Guid.NewGuid().ToString();
                            _dbContext.TblTranOrderVt.Add(i);
                        }
                        else
                        {
                            _dbContext.TblTranOrderVt.Update(i);
                        }
                    }
                }
                if (data.lstEquip != null)
                {
                    foreach (var e in data.lstEquip)
                    {
                        var equip = _dbContext.TblMdEquip.Find(e.Equnr);
                        equip.StatAct = e.Status;
                        equip.StatusTh = e.StatusTb;
                    }
                    _dbContext.TblTranOrderEq.UpdateRange(data.lstEquip);
                }

                if (data.lstOpe != null)
                {
                    _dbContext.TblTranOrderOperation.UpdateRange(data.lstOpe);
                }

                if (!string.IsNullOrEmpty(data.Plnnr) && _dbContext.TblTranOrderOperation.Where(x => x.Aufnr == data.Aufnr).Count() == 0)
                {
                    var task = await _dbContext.TblMdTasklist.Where(x => x.Plnnr == data.Plnnr).ToListAsync();
                    foreach (var t in task)
                    {
                        _dbContext.TblTranOrderOperation.Add(new TblTranOrderOperation
                        {
                            Id = Guid.NewGuid().ToString(),
                            Aufnr = data.Aufnr,
                            Vornr = t.Vornr,
                            Ltxa1 = t.Ltxa1
                        });
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

        public async Task UpdateListOrder(List<OrderDto> datas)
        {
            try
            {
                foreach (var data in datas)
                {
                    var entity = _mapper.Map<TblTranOrder>(data);
                    _dbContext.TblTranOrder.Update(entity);
                    if (!string.IsNullOrEmpty(data.Qmnum))
                    {
                        var noti = _dbContext.TblTranNoti.Find(data.Qmnum);
                        if (data.Status == "07" || data.Status == "04")
                        {
                            noti.StatAct = data.Status;
                        }
                        noti.Lvtsd = data.LoaivtSd;
                        noti.Htbtbd = data.HtBtbd;
                        _dbContext.TblTranNoti.Update(noti);
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

        public async Task<OrderDto> GetDetail(string code)
        {
            try
            {
                var entity = _dbContext.TblTranOrder.Find(code);
                var dto = _mapper.Map<OrderDto>(entity);
                dto.lstCatalog = await _dbContext.TblTranNotiCatalog.Where(x => x.Qmnum == dto.Qmnum).ToListAsync();
                dto.lstEquip = await _dbContext.TblTranOrderEq.Where(x => x.Aufnr == dto.Aufnr).ToListAsync();
                dto.lstVt = await _dbContext.TblTranOrderVt.Where(x => x.Aufnr == dto.Aufnr).ToListAsync();
                dto.lstOpe = await _dbContext.TblTranOrderOperation.Where(x => x.Aufnr == dto.Aufnr).OrderBy(x => x.Vornr).ToListAsync();
                return dto;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return new OrderDto();
            }
        }
    }
}