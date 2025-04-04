using AutoMapper;
using Common;
using EAM.CORE.Entities.AD;

namespace EAM.BUSINESS.Dtos.Common
{
    public class CreatorDto : IMapFrom, IDto
    {
        public string FullName { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblAdAccount, CreatorDto>().ReverseMap();
        }
    }
}
