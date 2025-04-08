using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class NotiAttDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Qmnum { get; set; }
        public string FileType { get; set; }
        public int? FileSize { get; set; }
        public string Path { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranNotiAtt, NotiAttDto>().ReverseMap();
        }
    }
} 