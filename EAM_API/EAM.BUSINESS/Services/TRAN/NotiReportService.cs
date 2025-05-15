using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiReportService : IGenericService<TblTranNotiReport, NotiReportDto>
    {
        Task<NotiReportDto> SaveReport(NotiReportDto report);
        Task<NotiReportDto> GetReportByQmnumAndType(string qmnum, string rpType);
        Task<IEnumerable<NotiReportDto>> GetReportsByQmnum(string qmnum);
    }
    public class NotiReportService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNotiReport, NotiReportDto>(dbContext, mapper), INotiReportService
    {
        public async Task<NotiReportDto> SaveReport(NotiReportDto report)
        {
            var existingReport = await _dbContext.Set<TblTranNotiReport>()
                .Where(x => x.Qmnum == report.Qmnum && x.RpType == report.RpType && x.IsActive == true)
                .FirstOrDefaultAsync();
            if (existingReport != null)
            {
                report.Id = existingReport.Id;
                await Update(report);
                return report;
            }
            report.Id = Guid.NewGuid().ToString();
            return await Add(report);
        }

        public async Task<NotiReportDto> GetReportByQmnumAndType(string qmnum, string rpType)
        {
            var report = await _dbContext.Set<TblTranNotiReport>()
                .Where(x => x.Qmnum == qmnum && x.RpType == rpType && x.IsActive == true)
                .FirstOrDefaultAsync();

            return _mapper.Map<NotiReportDto>(report);
        }

        public async Task<IEnumerable<NotiReportDto>> GetReportsByQmnum(string qmnum)
        {
            var reports = await _dbContext.Set<TblTranNotiReport>()
                .Where(x => x.Qmnum == qmnum && x.IsActive == true)
                .ToListAsync();

            return _mapper.Map<IEnumerable<NotiReportDto>>(reports);
        }
    }

}
