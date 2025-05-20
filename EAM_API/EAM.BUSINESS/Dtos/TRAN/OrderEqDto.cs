using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class OrderEqDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string? Aufnr { get; set; }
        public string? Equnr { get; set; }
        public string? Anlnr { get; set; }
        public string? Anlun { get; set; }
        public DateTime? Datab { get; set; }
        public TimeSpan? TimeF { get; set; }
        public DateTime? Datbi { get; set; }
        public TimeSpan? TimeT { get; set; }
        public string? Status { get; set; }
        public string? StatusTb { get; set; }
        public string? StatusTh { get; set; }
        public string? Note { get; set; }
        public string? StaffPl { get; set; }
        public string? StaffQl { get; set; }
        public string? StaffTh { get; set; }
        public string? StaffSd { get; set; }
        public string? State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranOrderEq, OrderEqDto>().ReverseMap();
        }
    }
} 