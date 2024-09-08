import React from 'react'

import { Card, CardContent } from "@/app/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select"

export default function VideoCard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Breaking bad Series</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-200 mb-4">
                {/* Replace with actual video player */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Video Player
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Season 1</SelectItem>
                    <SelectItem value="s2">Season 2</SelectItem>
                    <SelectItem value="s3">Season 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Episode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e1">Episode 1</SelectItem>
                    <SelectItem value="e2">Episode 2</SelectItem>
                    <SelectItem value="e3">Episode 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Previous Clip</Button>
                <Button variant="outline">Next Clip</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="vocabulary">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                  <TabsTrigger value="phrases">Phrases</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>
                <TabsContent value="vocabulary" className="mt-4">
                  <ul className="space-y-2">
                    <li>Word 1 - Definition</li>
                    <li>Word 2 - Definition</li>
                    <li>Word 3 - Definition</li>
                  </ul>
                </TabsContent>
                <TabsContent value="phrases" className="mt-4">
                  <ul className="space-y-2">
                    <li>Phrase 1 - Meaning</li>
                    <li>Phrase 2 - Meaning</li>
                    <li>Phrase 3 - Meaning</li>
                  </ul>
                </TabsContent>
                <TabsContent value="quiz" className="mt-4">
                  <div className="space-y-4">
                    <p>What does [word/phrase] mean in this context?</p>
                    <div className="space-y-2">
                      <button variant="outline" className="w-full justify-start">Option A</button>
                      <button variant="outline" className="w-full justify-start">Option B</button>
                      <button variant="outline" className="w-full justify-start">Option C</button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}