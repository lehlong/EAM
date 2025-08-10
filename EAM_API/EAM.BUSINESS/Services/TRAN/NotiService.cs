using AutoMapper;
using ClosedXML.Excel;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Filter.MD;
using EAM.BUSINESS.Filter.TRAN;
using EAM.BUSINESS.Model;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiService : IGenericService<TblTranNoti, NotiDto>
    {
        Task<string> GetLastQmnum();
        Task<string> ExportExcel(string qmnum);
        Task<string> GenerateQmnum(string qmart);
        Task<PagedResponseDto> SearchApproval(BaseFilter filter);
        Task<PagedResponseDto> SearchClose(BaseFilter filter);
        Task<byte[]> Export(BaseMdFilter filter);
        Task<NotiDto> Create(NotiDto dto);
        Task<PagedResponseDto> Search(NotiFilter filter);
        Task<DashboardModel> GetDataDashboard(string tplnr);
    }

    public class NotiService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNoti, NotiDto>(dbContext, mapper), INotiService
    {
        public async Task<string> ExportExcel(string qmnum)
        {
            try
            {
                var noti = await _dbContext.TblTranNoti.FindAsync(qmnum);
                string templatePath = Path.Combine("TemplateExcel", "PhieuDeNghiSuaChua.xlsx");
                DateTime now = DateTime.Now;
                string exportFolder = Path.Combine("ExportFiles",
                                                   now.Year.ToString(),
                                                   now.Month.ToString("D2"),
                                                   now.Day.ToString("D2"));
                Directory.CreateDirectory(exportFolder);
                string exportFileName = "PhieuDeNghiSuaChua.xlsx";
                string exportPath = Path.Combine(exportFolder, exportFileName);
                using (var workbook = new XLWorkbook(templatePath))
                {
                    var worksheet = workbook.Worksheet(1);

                    worksheet.Cell("G2").Value = noti.Qmnum;
                    worksheet.Cell("D8").Value = $"{noti.Equnr} - {_dbContext.TblMdEquip.Find(noti.Equnr)?.Eqktx}";
                    worksheet.Cell("D9").Value = $"{noti.Tplnr} - {_dbContext.TblMdFloc.Find(noti.Tplnr)?.Descript}";
                    worksheet.Cell("D10").Value = $"{noti.Priok} - {GetPriorityText(noti.Priok)}";
                    worksheet.Cell("D11").Value = $"{noti.HtDvql}";
                    worksheet.Cell("D12").Value = $"{noti.Iwerk} - {_dbContext.TblMdPlant.Find(noti.Iwerk)?.IwerkTxt}";
                    worksheet.Cell("D13").Value = $"{noti.HtDvsd}";
                    worksheet.Cell("D14").Value = noti.Qmdat?.ToString("dd/MM/yyyy");
                    worksheet.Cell("D15").Value = noti.Ltrmn?.ToString("dd/MM/yyyy");
                    worksheet.Cell("B18").Value = noti.Qmtxt;
                    worksheet.Cell("F28").Value = $"Ngày {DateTime.Now.Day} tháng {DateTime.Now.Month} năm {DateTime.Now.Year}";
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

        public string GetPriorityText(string priok)
        {
            switch (priok)
            {
                case "1":
                    return "Rất Cao";
                case "2":
                    return "Cao";
                case "3":
                    return "Trung Bình";
                case "4":
                    return "Thấp";
                case "5":
                    return "Rất Thấp";
                default:
                    return "";
            }
        }

        public async Task<DashboardModel> GetDataDashboard(string tplnr)
        {
            if (string.IsNullOrEmpty(tplnr))
            {
                return new DashboardModel();
            }
            try
            {
                var data = new DashboardModel();
                var lstEqCat = await _dbContext.TblMdEqCat.ToListAsync();
                var lstActiveStatus = await _dbContext.TblMdActiveStatus.ToListAsync();
                foreach (var i in lstEqCat)
                {
                    data.ChartBar.Add(new Dashboard
                    {
                        Name = i.EqtypTxt ?? "N/A",
                        Value = _dbContext.TblMdEquip.Where(x => x.Eqtyp == i.Eqtyp && x.Tplnr.Contains(tplnr)).Count()
                    });
                }

                foreach (var i in lstActiveStatus)
                {
                    data.ChartDonut.Add(new Dashboard
                    {
                        Name = i.Name ?? "N/A",
                        Value = _dbContext.TblMdEquip.Where(x => x.StatusTh == i.Code && x.Tplnr.Contains(tplnr)).Count()
                    });
                }

                var order = _dbContext.TblTranOrder.Where(x => x.Tplnr.Contains(tplnr)).AsQueryable();
                data.Order1 = order.Where(x => string.IsNullOrEmpty(x.Qmnum) && x.Status == "01").Count();
                data.Order2 = order.Where(x => string.IsNullOrEmpty(x.Qmnum) && x.Status == "07" && x.Gltrs < DateTime.Now).Count();
                data.Order3 = order.Where(x => string.IsNullOrEmpty(x.Qmnum) && x.Status == "07").Count();
                data.Order4 = order.Where(x => string.IsNullOrEmpty(x.Qmnum) && x.Status == "04").Count();

                var noti = _dbContext.TblTranNoti.Where(x => x.Tplnr.Contains(tplnr)).AsQueryable();
                data.Noti1 = noti.Count();
                data.Noti2 = noti.Where(x => x.StatAct == "07" && x.Ltrmn < DateTime.Now).Count();
                data.Noti3 = noti.Where(x => x.StatAct == "07").Count();
                data.Noti4 = noti.Where(x => x.StatAct == "01").Count();
                return data;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return new DashboardModel();
            }
        }
        public async Task<PagedResponseDto> Search(NotiFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmtxt.ToLower().Contains(filter.KeyWord.ToLower()) || x.Qmdetail.ToLower().Contains(filter.KeyWord.ToLower()));
                }
                if (!string.IsNullOrWhiteSpace(filter.Ingrp))
                {
                    query = query.Where(x => x.Ingrp == filter.Ingrp);
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
                if (filter.FromDate.HasValue)
                {
                    query = query.Where(x => x.Qmdat >= filter.FromDate);
                }
                if (filter.ToDate.HasValue)
                {
                    query = query.Where(x => x.Qmdat <= filter.ToDate);
                }

                if (!string.IsNullOrWhiteSpace(filter.StatAct))
                {
                    query = query.Where(x => x.StatAct == filter.StatAct);
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query.OrderByDescending(x => x.Qmnum), filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public async Task<NotiDto> Create(NotiDto dto)
        {
            try
            {
                var notiType = _dbContext.TblMdNotiType.Find(dto.Qmart);
                var qmnum = notiType.Sequence + _dbContext.TblTranNoti.Where(x => x.Qmart == dto.Qmart).Count();
                dto.Qmnum = qmnum.ToString();
                dto.Erdat = DateTime.Now;
                dto.StatAct = "01";

                var entity = _mapper.Map<TblTranNoti>(dto);
                await _dbContext.TblTranNoti.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<NotiDto>(entity);
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
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                        x.Qmtxt.Contains(filter.KeyWord) ||
                                        x.Iwerk.Contains(filter.KeyWord) ||
                                        x.Aufnr.Contains(filter.KeyWord) ||
                                        x.Equnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query.OrderByDescending(x => x.Qmnum), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<PagedResponseDto> SearchApproval(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                        x.Qmtxt.Contains(filter.KeyWord) ||
                                        x.Iwerk.Contains(filter.KeyWord) ||
                                        x.Aufnr.Contains(filter.KeyWord) ||
                                        x.Equnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query.Where(x => x.StatAct == "01").OrderByDescending(x => x.Qmnum), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<PagedResponseDto> SearchClose(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                        x.Qmtxt.Contains(filter.KeyWord) ||
                                        x.Iwerk.Contains(filter.KeyWord) ||
                                        x.Aufnr.Contains(filter.KeyWord) ||
                                        x.Equnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query.Where(x => x.StatAct == "04").OrderByDescending(x => x.Qmnum), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<string> GetLastQmnum()
        {
            try
            {
                var lastNoti = await _dbContext.TblTranNoti
                    .OrderByDescending(x => x.Qmnum)
                    .FirstOrDefaultAsync();

                return lastNoti?.Qmnum?.Trim() ?? "0";
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return "0";
            }
        }

        // Generate qmnum based on qmart type and count of existing records
        public async Task<string> GenerateQmnum(string qmart)
        {
            try
            {
                // Get sequence from notitype table based on qmart
                var notiType = await _dbContext.TblMdNotiType
                    .Where(nt => nt.Code == qmart)
                    .FirstOrDefaultAsync();

                if (notiType == null || !notiType.Sequence.HasValue)
                {
                    Status = false;
                    MessageObject.Message = $"Cannot find sequence for notification type: {qmart}";
                    return null;
                }

                // Get base sequence value
                int baseSequence = notiType.Sequence.Value;

                // Count existing notifications with the same qmart
                int existingCount = await _dbContext.TblTranNoti
                    .Where(n => n.Qmart == qmart)
                    .CountAsync();

                // Calculate new qmnum
                int newQmnum = baseSequence + existingCount;

                // Return as string
                return newQmnum.ToString();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public override async Task<NotiDto> Add(IDto dto)
        {
            try
            {
                // Cast to NotiDto
                var notiDto = dto as NotiDto;
                if (notiDto == null)
                {
                    Status = false;
                    MessageObject.Message = "Invalid DTO type";
                    return null;
                }

                // Generate qmnum based on qmart
                if (string.IsNullOrEmpty(notiDto.Qmnum) && !string.IsNullOrEmpty(notiDto.Qmart))
                {
                    notiDto.Qmnum = await GenerateQmnum(notiDto.Qmart);

                    if (notiDto.Qmnum == null)
                    {
                        // Failed to generate qmnum
                        Status = false;
                        return null;
                    }
                }

                // Set creation date and time
                notiDto.Erdat = DateTime.Now;
                notiDto.StatAct = "01";

                // Map and save entity
                var entity = _mapper.Map<TblTranNoti>(notiDto);
                await _dbContext.TblTranNoti.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<NotiDto>(entity);
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
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord));
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
                    if (x.Qmdat.HasValue)
                    {
                        x.QmdatTxt = x.Qmdat.Value.ToString("dd/MM/yyyy HH:mm:ss");
                    }

                    if (x.Ltrmn.HasValue)
                    {
                        x.LtrmnTxt = x.Ltrmn.Value.ToString("dd/MM/yyyy HH:mm:ss");
                    }
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
    }
}