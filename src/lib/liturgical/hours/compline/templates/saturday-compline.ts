import type {ComplineTemplate} from "../../hour-types"
import { complineConclusion, complineShortResponsory, introduction, nowThatTheDaylightDiesAway, nuncDimittis, salveRegina } from "../components"

export const saturdayCompline: ComplineTemplate = {
    id: "saturday-compline",
    dayOfWeek: 6,
    title: "Night Prayer - Saturday",
    introduction: introduction,
    hymn: nowThatTheDaylightDiesAway,
    psalmody: [
        {
            type: "psalm",
            language: "en",
            title: "",
            content: []
        }
    ],
    reading: {
        type: "reading",
        language: "en",
        content: []
    },
    responsory: complineShortResponsory,
    canticle: nuncDimittis,
    concludingPrayer: {
        type: "prayer",
        language: "en",
        content: [
        "Lord our God,",
        "restore us again by the repose of sleep",
        "after the fatigue of our daily work,",
        "so that, continually renewed by your help,",
        "we may serve you in body and soul.",
        "Through Christ our Lord.",
        "Amen."
        ]
    },
    conclusion: complineConclusion,
    marian: salveRegina
}