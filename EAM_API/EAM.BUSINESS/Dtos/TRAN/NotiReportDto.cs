using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class NotiReportDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; } = null!;
        public string RpType { get; set; }
        public string Qmnum { get; set; } = null!;
        public DateTime? RpDate { get; set; }
        public DateTime? RpTime { get; set; }
        public string? MgUnit { get; set; }
        public string? Unit1 { get; set; }
        public string? Unit2 { get; set; }
        public string? MgRole { get; set; }
        public string? Unit1R { get; set; }
        public string? Unit2R { get; set; }
        public string? Content { get; set; }
        public string? Output { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranNotiReport, NotiReportDto>().ReverseMap();
        }
    }
}
