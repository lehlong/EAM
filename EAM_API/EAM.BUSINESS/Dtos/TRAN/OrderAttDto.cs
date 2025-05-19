using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class OrderAttDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string Aufnr { get; set; }
        public string FileType { get; set; }
        public int? FileSize { get; set; }
        public string Path { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranOrderAtt, OrderAttDto>().ReverseMap();
        }
    }
} 