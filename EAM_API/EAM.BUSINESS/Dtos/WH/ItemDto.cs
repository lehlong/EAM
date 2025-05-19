using AutoMapper;
using Common;
using EAM.CORE.Entities.WH;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.BUSINESS.Dtos.WH
{
    public class ItemDto : BaseMdDto, IMapFrom, IDto
    {

        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã vật tư")]
        public string Matnr { get; set; } = null!;

        [Description("Tên vật tư")]
        public string Maktx { get; set; }

        [Description("Loại vật tư")]

        public string Mtart { get; set; }
        [Description("Nhóm vật tư")]

        public string Matkl { get; set; }
        [Description("Mã vật tư cũ")]

        public string Bismt { get; set; }
        [Description("Đơn vị tính")]

        public string Meins { get; set; }
        [Description("Nhà sản xuất")]

        public string? Mfrnr { get; set; }
        [Description("Ngày hết hạn")]

        public DateTime Sledbbd { get; set; }
        [Description("Model")]

        public string Model { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdItem, ItemDto>().ReverseMap();
        }
    }
}
