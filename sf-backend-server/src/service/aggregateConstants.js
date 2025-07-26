const projectDetails = [
  {
    $lookup: {
      from: "events",
      localField: "project_id",
      foreignField: "project_id",
      as: "Events"
    }
  },
  {
    $unwind: {
      path: "$Events",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "folders",
      localField: "Events.event_id",
      foreignField: "event_id",
      as: "Folders"
    }
  },
  {
    $unwind: {
      path: "$Folders",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "images",
      localField: "Folders.folder_id",
      foreignField: "folder_id",
      as: "Images"
    }
  },
  {
    $unwind: {
      path: "$Images",
      preserveNullAndEmptyArrays: false
    }
  }
];


const checkForInProgressStatus = [
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "projects",
        localField: "studio_id",
        foreignField: "studio_id",
        as: "Projects"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Projects",
        preserveNullAndEmptyArrays: false
      }
  },
  {
    $lookup: {
      from: "events",
      localField: "Projects.project_id",
      foreignField: "project_id",
      as: "Events"
    }
  },
  {
    $unwind: {
      path: "$Events",
      preserveNullAndEmptyArrays: false
    }
  },
  {
    $lookup: {
      from: "folders",
      localField: "Events.event_id",
      foreignField: "event_id",
      as: "Folders"
    }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Folders",
        preserveNullAndEmptyArrays: false
      }
  },

  {
    $project:
 
      {
        studio_id:1, 
        projectName: "$Projects.project_name",
        ProjectStatus: "$Projects.status",
        EventName: "$Events.event_name",
        EventStatus: "$Events.status",
        FolderName: "$Folders.folder_name",
        Folder_status: "$Folders.status"
      }
  }

];


/** USed to send the Folder COunt and selected image details to the UI */
const ProjectInfoForUI = [
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "events",
        localField: "project_id",
        foreignField: "project_id",
        as: "Events"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Events",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "folders",
        localField: "Events.event_id",
        foreignField: "event_id",
        as: "Folders"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Folders",
        preserveNullAndEmptyArrays: true
      }
  },
  // {
  //   $project:
  //     /**
  //      * specifications: The fields to
  //      *   include or exclude.
  //      */
  //     {
  //       project_id: 1,
  //       project_name: 1,
  //       status: 1,
  //       event_id: "$Events.event_id",
  //       event_name: "$Events.event_name",
  //       folder_name: "$Folders.folder_name",
  //       folder_id: "$Folders.folder_id",
  //       folder_status: "$Folders.status",
  //       count: "$Folders.studio_selected_count"
  //     }
  // }
  // {
  //   $lookup:
  //     /**
  //      * from: The target collection.
  //      * localField: The local join field.
  //      * foreignField: The target join field.
  //      * as: The name for the results.
  //      * pipeline: Optional pipeline to run on the foreign collection.
  //      * let: Optional variables to use in the pipeline field stages.
  //      */
  //     {
  //       from: "images",
  //       localField: "Folders.folder_id",
  //       foreignField: "folder_id",
  //       as: "Images"
  //     }
  // }
  // {
  //   $unwind:
  //     /**
  //      * path: Path to the array field.
  //      * includeArrayIndex: Optional name for index.
  //      * preserveNullAndEmptyArrays: Optional
  //      *   toggle to unwind null and empty values.
  //      */
  //     {
  //       path: "$Images",
  //       preserveNullAndEmptyArrays: true
  //     }
  // }
  {
    $project: {
      project_id: 1,
      project_name: 1,
      status: 1,
      event_id: "$Events.event_id",
      event_name: "$Events.event_name",
      folder_name: "$Folders.folder_name",
      folder_id: "$Folders.folder_id",
      folder_status: "$Folders.status",
      image_selected: "$Images.selected",
      image_order: "$Images.image_order",
      studio_count:
        "$Folders.studio_selected_count"
    }
  }
  // {
  //   $match:
  //     /**
  //      * query: The query in MQL.
  //      */
  //     {
  //       image_selected:
  //         "f65318a1-3374-56f1-a41f-701073bb65e0"
  //     }
  // }
  // {
  //   $group:
  //     /**
  //      * _id: The id of the group.
  //      * fieldN: The first field name.
  //      */
  //     {
  //       _id: "$Folders.folder_id",
  //       count: {
  //         $sum: 1
  //       }
  //     }
  // }
  // {
  //   $group:
  //     /**
  //      * _id: The id of the group.
  //      * fieldN: The first field name.
  //      */
  //     {
  //       _id: {
  //         event_id: "$event_id",
  //         folder_id: "$folder_id",
  //         studio_image_count: "$studio_count"
  //       },
  //       count: {
  //         $sum: 1
  //       }
  //     }
  // }
];


const clientSelctedFavImg = [
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "folders",
        localField: "folder_id",
        foreignField: "folder_id",
        as: "Folders"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Folders",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "events",
        localField: "Folders.event_id",
        foreignField: "event_id",
        as: "Events"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$Events",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        project_id: 1,
        event_id: "$Folders.event_id",
        folder_id: 1,
        image_id: 1,
        folder_name: "$Folders.folder_name",
        relative_path: 1,
        image_order: 1,
        image_base_path: "$Folders.base_path",
        selected: 1,
        favourite: 1,
        event_name: "$Events.event_name"
      }
  }
];


module.exports = { projectDetails, checkForInProgressStatus , ProjectInfoForUI, 
        clientSelctedFavImg };