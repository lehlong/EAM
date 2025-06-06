using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class OrderOperationDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Aufnr { get; set; }
        public string? Vornr { get; set; }
        public string? IsConfirm { get; set; }
        public string? Ltxa1 { get; set; }
        public string? Arbpl { get; set; }
        public string? Status { get; set; }
        public DateTime? DateCf { get; set; }
        public TimeSpan? DateCfTime { get; set; }
        public DateTime? DateCt { get; set; }
        public TimeSpan? DateCtTime { get; set; }
        public string? Note { get; set; }
        public string? Ndxn { get; set; }
        public string? StaffTh { get; set; }
        public string? StaffSd { get; set; }
        public bool? IsWork { get; set; }

        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranOrderOperation, OrderOperationDto>().ReverseMap();
        }
    }
} 