using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Utilities
{
    public static class SimpleObjectMapper
    {
        /// <summary>
        /// Convert a list of source objects as a new list target object
        /// </summary>
        /// <param name="sourceList"></param>
        /// <returns></returns>
        public static IList<TTarget> ListMap<TSource, TTarget>(IList<TSource> sourceList)
        {
            CreateMap<TSource, TTarget>();
            return AutoMapper.Mapper.Map<IList<TSource>, IList<TTarget>>(sourceList);
        }

        /// <summary>
        /// for each source object in the list, copy each source object's filed value to the target object 
        /// return the original list of target object, each with new filed values from source object
        /// </summary>
        /// <param name="sourceList"></param>
        /// <param name="targetList"></param>
        /// <returns></returns>
        public static IList<TTarget> ListMap<TSource, TTarget>(IList<TSource> sourceList, IList<TTarget> targetList)
        {
            CreateMap<TSource, TTarget>();
            return AutoMapper.Mapper.Map<IList<TSource>, IList<TTarget>>(sourceList, targetList);
        }

        /// <summary>
        /// Convert source object as a new target object
        /// </summary>
        /// <param name="sourceObj"></param>
        /// <returns></returns>
        public static TTarget CreateTargetObject<TSource, TTarget>(TSource sourceObj)
        {
            CreateMap<TSource, TTarget>();
            return AutoMapper.Mapper.Map<TSource, TTarget>(sourceObj);
        }

        /// <summary>
        /// Copy source object filed value to the target object and return the original target object with new filed values
        /// </summary>
        /// <param name="sourceObj"></param>
        /// <param name="targetObj"></param>
        /// <returns></returns>
        public static TTarget UpdateTargetObject<TSource, TTarget>(TSource sourceObj, TTarget targetObj)
        {
            CreateMap<TSource, TTarget>();
            return AutoMapper.Mapper.Map<TSource, TTarget>(sourceObj, targetObj);
        }

        private static void CreateMap<TSource, TTarget>()
        {
            AutoMapper.TypeMap mapInfo = AutoMapper.Mapper.FindTypeMapFor<TSource, TTarget>();
            if (mapInfo == null)
                AutoMapper.Mapper.CreateMap<TSource, TTarget>();
        }
    }
}