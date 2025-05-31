using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class TranEqCounterDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Mdocm { get; set; }
        public string? Point { get; set; }
        public string? Equnr { get; set; }
        public DateTime? IDate { get; set; }
        public decimal? Reading { get; set; }
        public string? Dvt { get; set; }
        public decimal? DifValue { get; set; }
        public string? ReadText { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranEqCounter, TranEqCounterDto>().ReverseMap();
        }
    }
}