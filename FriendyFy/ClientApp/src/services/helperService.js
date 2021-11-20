export function parseTime(minutes) {
    if(minutes < 2)
        return "Just Now";
    if(minutes < 60)
        return minutes+" minutes ago";
    if(minutes < 60*2)
        return parseInt(minutes/60)+" hour ago";
    if(minutes < 60*24)
        return parseInt(minutes/60)+" hours ago";
    if(minutes < 60*24*2)
        return parseInt(minutes/60/24)+" day ago";
    if(minutes < 60 * 24 * 365)
        return parseInt(minutes/60/24)+" days ago"
    if(minutes < 60 * 24 * 365 * 2)
        return parseInt(minutes/60/24/365)+" year ago"
    return parseInt(minutes/60/24)+" years ago"
  }